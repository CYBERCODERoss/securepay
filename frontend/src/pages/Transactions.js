import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Paper, 
  Chip, 
  IconButton, 
  TextField, 
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemIcon
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon, 
  GetApp as DownloadIcon, 
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Refresh as RefundIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Sample transaction data
const generateTransactions = () => {
  const statuses = ['Completed', 'Pending', 'Failed', 'Refunded'];
  const paymentMethods = ['Credit Card', 'Bank Transfer', 'PayPal', 'Apple Pay'];
  const customers = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'];
  
  return Array.from({ length: 100 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const amount = Math.floor(Math.random() * 1000) + 10;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    return {
      id: `TRX-${100000 + i}`,
      date: date.toISOString().split('T')[0],
      customer,
      amount: amount + (Math.random() * 10).toFixed(2),
      paymentMethod,
      status,
    };
  });
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Load transactions on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTransactions = async () => {
      // const response = await axios.get('/api/v1/transactions');
      // setTransactions(response.data);
      
      // For demo, use generated data
      const data = generateTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    };
    
    fetchTransactions();
  }, []);
  
  // Filter transactions when search query or filters change
  useEffect(() => {
    let result = transactions;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        tx => 
          tx.id.toLowerCase().includes(query) ||
          tx.customer.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(tx => tx.status === statusFilter);
    }
    
    // Apply date filter (simple exact match for demo)
    if (dateFilter) {
      result = result.filter(tx => tx.date === dateFilter);
    }
    
    // Apply amount filter (simple "greater than" for demo)
    if (amountFilter) {
      const minAmount = parseFloat(amountFilter);
      if (!isNaN(minAmount)) {
        result = result.filter(tx => parseFloat(tx.amount) >= minAmount);
      }
    }
    
    setFilteredTransactions(result);
    setPage(0);
  }, [searchQuery, statusFilter, dateFilter, amountFilter, transactions]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleClearFilters = () => {
    setStatusFilter('');
    setDateFilter('');
    setAmountFilter('');
    setFilterAnchorEl(null);
  };
  
  const handleActionClick = (event, transaction) => {
    setSelectedTransaction(transaction);
    setActionAnchorEl(event.currentTarget);
  };
  
  const handleActionClose = () => {
    setActionAnchorEl(null);
  };
  
  const handleViewDetails = () => {
    setActionAnchorEl(null);
    setDetailsOpen(true);
  };
  
  const handleDownloadReceipt = () => {
    // In a real app, this would download a receipt
    console.log('Download receipt for', selectedTransaction.id);
    setActionAnchorEl(null);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Get the status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      case 'Refunded':
        return 'info';
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{ borderRadius: '50px', px: 3 }}
        >
          Export
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        View and manage all your payment transactions.
      </Typography>
      
      {/* Search and Filter Bar */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Search transactions..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Box>
            {/* Filter button with indicator for active filters */}
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              color={statusFilter || dateFilter || amountFilter ? 'primary' : 'inherit'}
              sx={{ mr: 1, borderRadius: 28 }}
            >
              Filters
              {(statusFilter || dateFilter || amountFilter) && (
                <Box 
                  component="span" 
                  sx={{ 
                    ml: 1, 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 20, 
                    height: 20,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12
                  }}
                >
                  {(statusFilter ? 1 : 0) + (dateFilter ? 1 : 0) + (amountFilter ? 1 : 0)}
                </Box>
              )}
            </Button>
          </Box>
          
          {/* Filter Menu */}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: { width: 300, maxWidth: '100%', mt: 1 }
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">Filters</Typography>
              <Typography variant="body2" color="text.secondary">Refine your transaction list</Typography>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Status
              </Typography>
              <Grid container spacing={1}>
                {['Completed', 'Pending', 'Failed', 'Refunded'].map((status) => (
                  <Grid item key={status}>
                    <Chip 
                      label={status} 
                      clickable
                      color={statusFilter === status ? 'primary' : 'default'}
                      onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>
              
              <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
                Date
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Minimum Amount
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="number"
                placeholder="Min amount"
                value={amountFilter}
                onChange={(e) => setAmountFilter(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClearFilters} sx={{ mr: 1 }}>
                Clear All
              </Button>
              <Button variant="contained" onClick={handleFilterClose}>
                Apply Filters
              </Button>
            </Box>
          </Menu>
        </CardContent>
      </Card>
      
      {/* Transactions Table */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="transactions table">
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="transaction-item"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        color={getStatusColor(transaction.status)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleActionClick(e, transaction)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        
        <MenuItem onClick={handleDownloadReceipt}>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          Download Receipt
        </MenuItem>
        
        {selectedTransaction?.status === 'Completed' && (
          <MenuItem onClick={handleActionClose}>
            <ListItemIcon>
              <RefundIcon fontSize="small" />
            </ListItemIcon>
            Issue Refund
          </MenuItem>
        )}
      </Menu>
      
      {/* Transaction Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Transaction Details
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedTransaction && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Transaction ID
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedTransaction.id}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {selectedTransaction.date}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1">
                  {selectedTransaction.customer}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="body1">
                  {selectedTransaction.paymentMethod}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(selectedTransaction.amount)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedTransaction.status}
                  color={getStatusColor(selectedTransaction.status)}
                  size="small"
                  sx={{ fontWeight: 500, mt: 0.5 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Payment Details
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Card Type
                </Typography>
                <Typography variant="body1">
                  Visa ending in 4242
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Card Holder
                </Typography>
                <Typography variant="body1">
                  {selectedTransaction.customer}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Additional Information
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  IP Address
                </Typography>
                <Typography variant="body1">
                  192.168.1.1
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Country
                </Typography>
                <Typography variant="body1">
                  United States
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleDownloadReceipt}>
            Download Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions; 