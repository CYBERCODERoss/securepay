package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

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
			"service": "api-gateway",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// API routes groups
	v1 := r.Group("/api/v1")
	{
		// Auth service routes
		auth := v1.Group("/auth")
		{
			auth.POST("/login", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Login endpoint"})
			})
			auth.POST("/register", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Register endpoint"})
			})
			auth.POST("/logout", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Logout endpoint"})
			})
			auth.GET("/user", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Get user endpoint"})
			})
			auth.POST("/refresh", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Refresh token endpoint"})
			})
		}

		// Payment service routes
		payment := v1.Group("/payments")
		{
			payment.POST("/process", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Process payment endpoint"})
			})
			payment.GET("/status/:id", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "Payment status", "id": id})
			})
			payment.GET("/", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "List payments endpoint"})
			})
			payment.POST("/refund/:id", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "Refund payment", "id": id})
			})
		}

		// Transaction service routes
		transactions := v1.Group("/transactions")
		{
			transactions.GET("/", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "List transactions endpoint"})
			})
			transactions.GET("/:id", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "Transaction details", "id": id})
			})
			transactions.GET("/stats", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Transaction statistics endpoint"})
			})
		}

		// User service routes
		users := v1.Group("/users")
		{
			users.GET("/", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "List users endpoint"})
			})
			users.GET("/:id", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "User details", "id": id})
			})
			users.PUT("/:id", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "Update user", "id": id})
			})
			users.POST("/", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Create user endpoint"})
			})
			users.PUT("/:id/deactivate", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "Deactivate user", "id": id})
			})
		}

		// Notification service routes
		notifications := v1.Group("/notifications")
		{
			notifications.GET("/user/:userId", func(c *gin.Context) {
				userId := c.Param("userId")
				c.JSON(http.StatusOK, gin.H{"message": "Get user notifications", "user_id": userId})
			})
			notifications.POST("/", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Create notification endpoint"})
			})
			notifications.PUT("/:id/read", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "Mark notification as read", "id": id})
			})
			notifications.PUT("/user/:userId/read-all", func(c *gin.Context) {
				userId := c.Param("userId")
				c.JSON(http.StatusOK, gin.H{"message": "Mark all notifications as read", "user_id": userId})
			})
		}

		// Fraud detection service routes
		fraud := v1.Group("/fraud")
		{
			fraud.POST("/analyze", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Analyze transaction for fraud"})
			})
			fraud.GET("/transaction/:transactionId", func(c *gin.Context) {
				id := c.Param("transactionId")
				c.JSON(http.StatusOK, gin.H{"message": "Get transaction risk assessment", "transaction_id": id})
			})
			fraud.GET("/user/:userId", func(c *gin.Context) {
				userId := c.Param("userId")
				c.JSON(http.StatusOK, gin.H{"message": "Get user risk history", "user_id": userId})
			})
		}

		// Subscription service routes
		subscriptions := v1.Group("/subscriptions")
		{
			subscriptions.GET("/plans", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "List subscription plans"})
			})
			subscriptions.GET("/customer/:customerId", func(c *gin.Context) {
				customerId := c.Param("customerId")
				c.JSON(http.StatusOK, gin.H{"message": "Get customer subscriptions", "customer_id": customerId})
			})
			subscriptions.POST("/subscribe", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Create subscription"})
			})
			subscriptions.PUT("/:id/cancel", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "Cancel subscription", "id": id})
			})
			subscriptions.PUT("/:id/upgrade", func(c *gin.Context) {
				id := c.Param("id")
				c.JSON(http.StatusOK, gin.H{"message": "Upgrade subscription", "id": id})
			})
		}

		// Analytics service routes
		analytics := v1.Group("/analytics")
		{
			analytics.GET("/dashboard", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Dashboard analytics"})
			})
			analytics.GET("/transactions", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Transaction analytics"})
			})
			analytics.GET("/users", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "User analytics"})
			})
			analytics.GET("/revenue", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Revenue analytics"})
			})
		}
	}

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("API Gateway starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start API Gateway: %v", err)
	}
} 