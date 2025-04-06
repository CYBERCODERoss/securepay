package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// MockPayments represents a simple in-memory payment store for demonstration
var MockPayments = []gin.H{
	{
		"id":             "pmt_1",
		"amount":         125.50,
		"currency":       "USD",
		"status":         "succeeded",
		"payment_method": "card",
		"customer_id":    "cus_1",
		"created_at":     "2023-04-01T10:30:00Z",
	},
	{
		"id":             "pmt_2",
		"amount":         75.20,
		"currency":       "USD",
		"status":         "succeeded",
		"payment_method": "bank_transfer",
		"customer_id":    "cus_2",
		"created_at":     "2023-04-02T14:20:00Z",
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
			"service": "payment-service",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Payment endpoints
	r.POST("/process", handleProcessPayment)
	r.GET("/status/:id", handleGetPaymentStatus)
	r.GET("/", handleListPayments)
	r.POST("/refund/:id", handleRefundPayment)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4002"
	}

	log.Printf("Payment Service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start Payment Service: %v", err)
	}
}

func handleProcessPayment(c *gin.Context) {
	var paymentRequest struct {
		Amount         float64 `json:"amount" binding:"required"`
		Currency       string  `json:"currency" binding:"required"`
		PaymentMethod  string  `json:"payment_method" binding:"required"`
		CustomerId     string  `json:"customer_id" binding:"required"`
		SavePaymentMethod bool  `json:"save_payment_method"`
	}

	if err := c.ShouldBindJSON(&paymentRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Generate a payment ID
	paymentId := "pmt_" + uuid.New().String()[:8]

	// Create a new payment record
	payment := gin.H{
		"id":                paymentId,
		"amount":            paymentRequest.Amount,
		"currency":          paymentRequest.Currency,
		"status":            "succeeded", // Always succeed for demo
		"payment_method":    paymentRequest.PaymentMethod,
		"customer_id":       paymentRequest.CustomerId,
		"created_at":        time.Now().Format(time.RFC3339),
		"transaction_id":    "txn_" + uuid.New().String()[:8],
	}

	// Add to mock payments (in a real app, we'd save to a database)
	MockPayments = append(MockPayments, payment)

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment processed successfully",
		"payment": payment,
	})
}

func handleGetPaymentStatus(c *gin.Context) {
	id := c.Param("id")

	// Search for the payment in our mock data
	for _, payment := range MockPayments {
		if payment["id"] == id {
			c.JSON(http.StatusOK, gin.H{
				"payment": payment,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
}

func handleListPayments(c *gin.Context) {
	// Return all mock payments
	c.JSON(http.StatusOK, gin.H{
		"payments": MockPayments,
		"count":    len(MockPayments),
	})
}

func handleRefundPayment(c *gin.Context) {
	id := c.Param("id")

	// Search for the payment in our mock data
	for i, payment := range MockPayments {
		if payment["id"] == id {
			// Create a refund
			refundId := "ref_" + uuid.New().String()[:8]
			
			// Update the payment status
			MockPayments[i]["status"] = "refunded"
			
			c.JSON(http.StatusOK, gin.H{
				"message": "Payment refunded successfully",
				"refund": gin.H{
					"id":         refundId,
					"payment_id": id,
					"amount":     payment["amount"],
					"status":     "succeeded",
					"created_at": time.Now().Format(time.RFC3339),
				},
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
} 