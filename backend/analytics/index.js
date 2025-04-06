const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createLogger, format, transports } = require('winston');
const promClient = require('prom-client');
const Redis = require('ioredis');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { formatISO, subDays, startOfDay, endOfDay, parseISO } = require('date-fns');

// Load environment variables
dotenv.config();

// Initialize logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console()
  ]
});

// Initialize Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
});

register.registerMetric(httpRequestDurationMicroseconds);

// Initialize database connection pool
const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'securepay_analytics',
  password: process.env.DB_PASSWORD || 'secure_password',
  port: parseInt(process.env.DB_PORT || '5432')
});

// Initialize Redis client for caching
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

// Create Express app
const app = express();
const port = parseInt(process.env.PORT || '8087');

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  }
});

// Apply rate limiter to API endpoints
app.use('/api/', apiLimiter);

// Metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// API Routes
const apiRouter = express.Router();

// Get transaction metrics
apiRouter.get('/transactions/metrics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? parseISO(startDate) : subDays(new Date(), 30);
    const end = endDate ? parseISO(endDate) : new Date();

    // Try to get from cache first
    const cacheKey = `metrics:transactions:${formatISO(start)}:${formatISO(end)}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      logger.info('Retrieved transaction metrics from cache');
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, query database
    const { rows } = await db.query(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS total_count,
        SUM(amount) AS total_amount,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) AS success_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_count
      FROM transactions
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [start, end]);

    const result = {
      totalTransactions: rows.reduce((sum, row) => sum + parseInt(row.total_count), 0),
      totalAmount: rows.reduce((sum, row) => sum + parseFloat(row.total_amount), 0),
      successRate: rows.reduce((sum, row) => sum + parseInt(row.success_count), 0) / 
                  (rows.reduce((sum, row) => sum + parseInt(row.total_count), 0) || 1),
      dailyData: rows.map(row => ({
        date: row.date,
        totalCount: parseInt(row.total_count),
        totalAmount: parseFloat(row.total_amount),
        successCount: parseInt(row.success_count),
        failedCount: parseInt(row.failed_count)
      }))
    };

    // Store in cache for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to get transaction metrics', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to get transaction metrics' });
  }
});

// Get revenue analytics
apiRouter.get('/revenue/analytics', async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    const start = startDate ? parseISO(startDate) : subDays(new Date(), period === 'week' ? 7 : 30);
    const end = endDate ? parseISO(endDate) : new Date();

    // Try to get from cache first
    const cacheKey = `analytics:revenue:${period}:${formatISO(start)}:${formatISO(end)}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      logger.info('Retrieved revenue analytics from cache');
      return res.json(JSON.parse(cachedData));
    }

    // SQL query depends on the period
    let timeFormat;
    if (period === 'day') {
      timeFormat = 'YYYY-MM-DD HH24:00:00';
    } else if (period === 'week') {
      timeFormat = 'YYYY-WW';
    } else if (period === 'month') {
      timeFormat = 'YYYY-MM';
    } else {
      timeFormat = 'YYYY';
    }

    const { rows } = await db.query(`
      SELECT 
        TO_CHAR(created_at, $1) AS time_period,
        SUM(amount) AS revenue,
        COUNT(*) AS transaction_count,
        payment_method
      FROM transactions
      WHERE created_at BETWEEN $2 AND $3
        AND status = 'success'
      GROUP BY time_period, payment_method
      ORDER BY time_period, payment_method
    `, [timeFormat, start, end]);

    // Process the data
    const result = {
      totalRevenue: rows.reduce((sum, row) => sum + parseFloat(row.revenue), 0),
      transactionCount: rows.reduce((sum, row) => sum + parseInt(row.transaction_count), 0),
      byPeriod: {},
      byPaymentMethod: {}
    };

    // Group by time period and payment method
    rows.forEach(row => {
      // By time period
      if (!result.byPeriod[row.time_period]) {
        result.byPeriod[row.time_period] = {
          revenue: 0,
          transactionCount: 0,
          paymentMethods: {}
        };
      }
      
      result.byPeriod[row.time_period].revenue += parseFloat(row.revenue);
      result.byPeriod[row.time_period].transactionCount += parseInt(row.transaction_count);
      
      if (!result.byPeriod[row.time_period].paymentMethods[row.payment_method]) {
        result.byPeriod[row.time_period].paymentMethods[row.payment_method] = {
          revenue: 0,
          transactionCount: 0
        };
      }
      
      result.byPeriod[row.time_period].paymentMethods[row.payment_method].revenue += parseFloat(row.revenue);
      result.byPeriod[row.time_period].paymentMethods[row.payment_method].transactionCount += parseInt(row.transaction_count);
      
      // By payment method
      if (!result.byPaymentMethod[row.payment_method]) {
        result.byPaymentMethod[row.payment_method] = {
          revenue: 0,
          transactionCount: 0
        };
      }
      
      result.byPaymentMethod[row.payment_method].revenue += parseFloat(row.revenue);
      result.byPaymentMethod[row.payment_method].transactionCount += parseInt(row.transaction_count);
    });

    // Convert byPeriod from object to array for easier consumption
    result.periodicData = Object.keys(result.byPeriod).map(period => ({
      period,
      ...result.byPeriod[period]
    }));
    
    delete result.byPeriod;

    // Store in cache for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to get revenue analytics', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to get revenue analytics' });
  }
});

// Get customer analytics
apiRouter.get('/customers/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? parseISO(startDate) : subDays(new Date(), 30);
    const end = endDate ? parseISO(endDate) : new Date();

    // Try to get from cache first
    const cacheKey = `analytics:customers:${formatISO(start)}:${formatISO(end)}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      logger.info('Retrieved customer analytics from cache');
      return res.json(JSON.parse(cachedData));
    }

    // Get new customers by day
    const newCustomersQuery = await db.query(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS new_customers
      FROM customers
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [start, end]);

    // Get active customers (those who made transactions)
    const activeCustomersQuery = await db.query(`
      SELECT 
        DATE(t.created_at) AS date,
        COUNT(DISTINCT t.customer_id) AS active_customers
      FROM transactions t
      WHERE t.created_at BETWEEN $1 AND $2
      GROUP BY DATE(t.created_at)
      ORDER BY date
    `, [start, end]);

    // Get average transaction value by customer
    const avgTransactionQuery = await db.query(`
      SELECT 
        t.customer_id,
        c.name,
        AVG(t.amount) AS avg_transaction,
        COUNT(*) AS transaction_count,
        SUM(t.amount) AS total_spent
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      WHERE t.created_at BETWEEN $1 AND $2
        AND t.status = 'success'
      GROUP BY t.customer_id, c.name
      ORDER BY total_spent DESC
      LIMIT 10
    `, [start, end]);

    // Process the data
    const result = {
      newCustomers: newCustomersQuery.rows.reduce((sum, row) => sum + parseInt(row.new_customers), 0),
      activeCustomers: activeCustomersQuery.rows.reduce((sum, row) => sum + parseInt(row.active_customers), 0),
      dailyData: newCustomersQuery.rows.map(row => {
        const activeRow = activeCustomersQuery.rows.find(r => r.date.toISOString() === row.date.toISOString());
        return {
          date: row.date,
          newCustomers: parseInt(row.new_customers),
          activeCustomers: activeRow ? parseInt(activeRow.active_customers) : 0
        };
      }),
      topCustomers: avgTransactionQuery.rows.map(row => ({
        customerId: row.customer_id,
        name: row.name,
        avgTransaction: parseFloat(row.avg_transaction),
        transactionCount: parseInt(row.transaction_count),
        totalSpent: parseFloat(row.total_spent)
      }))
    };

    // Store in cache for 30 minutes
    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 1800);
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to get customer analytics', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to get customer analytics' });
  }
});

// Get fraud analytics
apiRouter.get('/fraud/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? parseISO(startDate) : subDays(new Date(), 30);
    const end = endDate ? parseISO(endDate) : new Date();

    // Try to get from cache first
    const cacheKey = `analytics:fraud:${formatISO(start)}:${formatISO(end)}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      logger.info('Retrieved fraud analytics from cache');
      return res.json(JSON.parse(cachedData));
    }

    // Get fraud metrics by day
    const fraudMetricsQuery = await db.query(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS total_count,
        SUM(CASE WHEN fraud_score > 80 THEN 1 ELSE 0 END) AS high_risk_count,
        SUM(CASE WHEN fraud_score BETWEEN 50 AND 80 THEN 1 ELSE 0 END) AS medium_risk_count,
        SUM(CASE WHEN fraud_score < 50 THEN 1 ELSE 0 END) AS low_risk_count,
        AVG(fraud_score) AS avg_fraud_score
      FROM fraud_checks
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [start, end]);

    // Get fraud by risk factors
    const riskFactorsQuery = await db.query(`
      SELECT 
        risk_factor,
        COUNT(*) AS count
      FROM fraud_check_factors
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY risk_factor
      ORDER BY count DESC
    `, [start, end]);

    // Get blocked transactions
    const blockedTransactionsQuery = await db.query(`
      SELECT 
        COUNT(*) AS count,
        SUM(amount) AS total_amount,
        block_reason
      FROM blocked_transactions
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY block_reason
      ORDER BY count DESC
    `, [start, end]);

    // Process the data
    const result = {
      totalChecks: fraudMetricsQuery.rows.reduce((sum, row) => sum + parseInt(row.total_count), 0),
      highRiskCount: fraudMetricsQuery.rows.reduce((sum, row) => sum + parseInt(row.high_risk_count), 0),
      mediumRiskCount: fraudMetricsQuery.rows.reduce((sum, row) => sum + parseInt(row.medium_risk_count), 0),
      lowRiskCount: fraudMetricsQuery.rows.reduce((sum, row) => sum + parseInt(row.low_risk_count), 0),
      avgFraudScore: fraudMetricsQuery.rows.reduce((sum, row) => sum + parseFloat(row.avg_fraud_score) * parseInt(row.total_count), 0) / 
                    (fraudMetricsQuery.rows.reduce((sum, row) => sum + parseInt(row.total_count), 0) || 1),
      dailyData: fraudMetricsQuery.rows.map(row => ({
        date: row.date,
        totalChecks: parseInt(row.total_count),
        highRiskCount: parseInt(row.high_risk_count),
        mediumRiskCount: parseInt(row.medium_risk_count),
        lowRiskCount: parseInt(row.low_risk_count),
        avgFraudScore: parseFloat(row.avg_fraud_score)
      })),
      riskFactors: riskFactorsQuery.rows.map(row => ({
        factor: row.risk_factor,
        count: parseInt(row.count)
      })),
      blockedTransactions: blockedTransactionsQuery.rows.map(row => ({
        reason: row.block_reason,
        count: parseInt(row.count),
        amount: parseFloat(row.total_amount)
      }))
    };

    // Store in cache for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to get fraud analytics', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to get fraud analytics' });
  }
});

// Mount API router
app.use('/api/v1', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  logger.info(`Analytics service running on port ${port}`);
});

// Handle process termination
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  logger.info('Received shutdown signal, closing connections...');
  
  try {
    await db.end();
    await redisClient.quit();
    logger.info('Connections closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { error: error.message });
    process.exit(1);
  }
}

module.exports = app; // For testing 