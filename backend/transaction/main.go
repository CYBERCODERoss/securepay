package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// MockTransactions represents a simple in-memory transaction store for demonstration
var MockTransactions = []gin.H{
	{
		"id":             "txn_1",
		"amount":         120.50,
		"currency":       "USD",
		"status":         "completed",
		"customer_name":  "John Doe",
		"customer_email": "john@example.com",
		"payment_method": "card",
		"created_at":     "2023-04-06T10:30:00Z",
	},
	{
		"id":             "txn_2",
		"amount":         75.20,
		"currency":       "USD",
		"status":         "completed",
		"customer_name":  "Jane Smith",
		"customer_email": "jane@example.com",
		"payment_method": "bank_transfer",
		"created_at":     "2023-04-05T14:20:00Z",
	},
	{
		"id":             "txn_3",
		"amount":         250.00,
		"currency":       "USD",
		"status":         "pending",
		"customer_name":  "Robert Johnson",
		"customer_email": "robert@example.com",
		"payment_method": "card",
		"created_at":     "2023-04-06T09:15:00Z",
	},
	{
		"id":             "txn_4",
		"amount":         35.99,
		"currency":       "USD",
		"status":         "completed",
		"customer_name":  "Emily Davis",
		"customer_email": "emily@example.com",
		"payment_method": "wallet",
		"created_at":     "2023-04-04T16:45:00Z",
	},
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
			"service": "transaction-service",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Transaction endpoints
	r.GET("/", handleListTransactions)
	r.GET("/:id", handleGetTransaction)
	r.GET("/stats", handleGetTransactionStats)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4003"
	}

	log.Printf("Transaction Service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start Transaction Service: %v", err)
	}
}

func handleListTransactions(c *gin.Context) {
	// Filter by status if provided
	status := c.Query("status")
	if status != "" {
		var filteredTransactions []gin.H
		for _, transaction := range MockTransactions {
			if transaction["status"] == status {
				filteredTransactions = append(filteredTransactions, transaction)
			}
		}
		
		c.JSON(http.StatusOK, gin.H{
			"transactions": filteredTransactions,
			"count":        len(filteredTransactions),
		})
		return
	}
	
	// Return all transactions
	c.JSON(http.StatusOK, gin.H{
		"transactions": MockTransactions,
		"count":        len(MockTransactions),
	})
}

func handleGetTransaction(c *gin.Context) {
	id := c.Param("id")

	// Search for the transaction
	for _, transaction := range MockTransactions {
		if transaction["id"] == id {
			c.JSON(http.StatusOK, gin.H{
				"transaction": transaction,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
}

func handleGetTransactionStats(c *gin.Context) {
	// Calculate basic statistics
	var totalAmount float64
	var completedAmount float64
	var pendingAmount float64
	
	completed := 0
	pending := 0
	
	for _, transaction := range MockTransactions {
		amount := transaction["amount"].(float64)
		totalAmount += amount
		
		if transaction["status"] == "completed" {
			completedAmount += amount
			completed++
		} else if transaction["status"] == "pending" {
			pendingAmount += amount
			pending++
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"total_count":        len(MockTransactions),
			"total_amount":       totalAmount,
			"completed_count":    completed,
			"completed_amount":   completedAmount,
			"pending_count":      pending,
			"pending_amount":     pendingAmount,
			"last_updated":       time.Now().Format(time.RFC3339),
		},
	})
} 