package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// MockTransactionStats represents daily transaction stats
var MockTransactionStats = []gin.H{
	{
		"date":          "2023-04-01",
		"count":         24,
		"total_amount":  1258.75,
		"currency":      "USD",
		"success_rate":  0.95,
		"avg_amount":    52.45,
	},
	{
		"date":          "2023-04-02",
		"count":         18,
		"total_amount":  876.20,
		"currency":      "USD",
		"success_rate":  0.92,
		"avg_amount":    48.68,
	},
	{
		"date":          "2023-04-03",
		"count":         31,
		"total_amount":  1547.80,
		"currency":      "USD",
		"success_rate":  0.98,
		"avg_amount":    49.93,
	},
	{
		"date":          "2023-04-04",
		"count":         27,
		"total_amount":  1325.99,
		"currency":      "USD",
		"success_rate":  0.96,
		"avg_amount":    49.11,
	},
	{
		"date":          "2023-04-05",
		"count":         22,
		"total_amount":  1087.45,
		"currency":      "USD",
		"success_rate":  0.94,
		"avg_amount":    49.43,
	},
	{
		"date":          "2023-04-06",
		"count":         15,
		"total_amount":  780.50,
		"currency":      "USD",
		"success_rate":  0.93,
		"avg_amount":    52.03,
	},
}

// MockUserStats represents user analytics data
var MockUserStats = gin.H{
	"total_users":     250,
	"active_users":    180,
	"new_users_today": 5,
	"new_users_week":  23,
	"new_users_month": 47,
	"conversion_rate": 0.65,
	"churn_rate":      0.05,
}

// MockRevenueData represents revenue analytics
var MockRevenueData = gin.H{
	"daily": []gin.H{
		{"date": "2023-04-01", "amount": 1258.75},
		{"date": "2023-04-02", "amount": 876.20},
		{"date": "2023-04-03", "amount": 1547.80},
		{"date": "2023-04-04", "amount": 1325.99},
		{"date": "2023-04-05", "amount": 1087.45},
		{"date": "2023-04-06", "amount": 780.50},
	},
	"monthly": []gin.H{
		{"month": "2023-01", "amount": 28754.32},
		{"month": "2023-02", "amount": 31245.87},
		{"month": "2023-03", "amount": 35120.45},
		{"month": "2023-04", "amount": 6876.69},
	},
	"mtd": 6876.69,
	"ytd": 101997.33,
	"projected_monthly": 32500.00,
	"growth_rate": 0.12,
}

func main() {
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "analytics-service",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Analytics endpoints
	r.GET("/dashboard", handleGetDashboardStats)
	r.GET("/transactions", handleGetTransactionStats)
	r.GET("/users", handleGetUserStats)
	r.GET("/revenue", handleGetRevenueStats)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4008"
	}

	log.Printf("Analytics Service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start Analytics Service: %v", err)
	}
}

func handleGetDashboardStats(c *gin.Context) {
	// Calculate totals from transaction stats
	var totalTransactions int = 0
	var totalRevenue float64 = 0
	
	for _, stats := range MockTransactionStats {
		totalTransactions += stats["count"].(int)
		totalRevenue += stats["total_amount"].(float64)
	}
	
	// Return all dashboard stats
	c.JSON(http.StatusOK, gin.H{
		"transaction_stats": gin.H{
			"total_count":  totalTransactions,
			"total_volume": totalRevenue,
			"success_rate": 0.95,
		},
		"user_stats": gin.H{
			"total_users":     MockUserStats["total_users"],
			"active_users":    MockUserStats["active_users"],
			"new_users_week":  MockUserStats["new_users_week"],
		},
		"revenue_stats": gin.H{
			"mtd": MockRevenueData["mtd"],
			"ytd": MockRevenueData["ytd"],
		},
		"last_updated": time.Now().Format(time.RFC3339),
	})
}

func handleGetTransactionStats(c *gin.Context) {
	// Get date range parameters, default to 7 days
	startDate := c.DefaultQuery("start_date", "")
	endDate := c.DefaultQuery("end_date", "")
	
	// In a real implementation, we would filter by date range
	// For this demo, we'll return all mock data
	
	c.JSON(http.StatusOK, gin.H{
		"daily_stats": MockTransactionStats,
		"start_date":  startDate,
		"end_date":    endDate,
		"last_updated": time.Now().Format(time.RFC3339),
	})
}

func handleGetUserStats(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"user_stats":   MockUserStats,
		"last_updated": time.Now().Format(time.RFC3339),
	})
}

func handleGetRevenueStats(c *gin.Context) {
	// Get period parameter, default to "all"
	period := c.DefaultQuery("period", "all")
	
	var responseData gin.H
	
	switch period {
	case "daily":
		responseData = gin.H{"data": MockRevenueData["daily"]}
	case "monthly":
		responseData = gin.H{"data": MockRevenueData["monthly"]}
	default:
		responseData = gin.H{"data": MockRevenueData}
	}
	
	responseData["period"] = period
	responseData["last_updated"] = time.Now().Format(time.RFC3339)
	
	c.JSON(http.StatusOK, responseData)
} 