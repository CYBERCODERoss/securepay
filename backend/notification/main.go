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

// MockNotifications represents a simple in-memory notification store
var MockNotifications = []gin.H{
	{
		"id":         "ntf_1",
		"user_id":    "usr_1",
		"type":       "payment_success",
		"message":    "Your payment of $120.50 was successful",
		"read":       false,
		"created_at": "2023-04-06T10:35:00Z",
	},
	{
		"id":         "ntf_2",
		"user_id":    "usr_2",
		"type":       "payment_success",
		"message":    "Your payment of $75.20 was successful",
		"read":       true,
		"created_at": "2023-04-05T14:25:00Z",
	},
	{
		"id":         "ntf_3",
		"user_id":    "usr_3",
		"type":       "payment_pending",
		"message":    "Your payment of $250.00 is pending",
		"read":       false,
		"created_at": "2023-04-06T09:20:00Z",
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
			"service": "notification-service",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Notification endpoints
	r.GET("/user/:userId", handleGetUserNotifications)
	r.POST("/", handleCreateNotification)
	r.PUT("/:id/read", handleMarkAsRead)
	r.PUT("/user/:userId/read-all", handleMarkAllAsRead)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4005"
	}

	log.Printf("Notification Service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start Notification Service: %v", err)
	}
}

func handleGetUserNotifications(c *gin.Context) {
	userId := c.Param("userId")
	
	// Filter notifications by user ID
	var userNotifications []gin.H
	for _, notification := range MockNotifications {
		if notification["user_id"] == userId {
			userNotifications = append(userNotifications, notification)
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"notifications": userNotifications,
		"count":         len(userNotifications),
	})
}

func handleCreateNotification(c *gin.Context) {
	var notificationRequest struct {
		UserId  string `json:"user_id" binding:"required"`
		Type    string `json:"type" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&notificationRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Create a new notification
	notificationId := "ntf_" + uuid.New().String()[:8]
	
	newNotification := gin.H{
		"id":         notificationId,
		"user_id":    notificationRequest.UserId,
		"type":       notificationRequest.Type,
		"message":    notificationRequest.Message,
		"read":       false,
		"created_at": time.Now().Format(time.RFC3339),
	}
	
	// Add to mock notifications
	MockNotifications = append(MockNotifications, newNotification)
	
	c.JSON(http.StatusCreated, gin.H{
		"message":      "Notification created successfully",
		"notification": newNotification,
	})
}

func handleMarkAsRead(c *gin.Context) {
	id := c.Param("id")

	// Find and mark the notification as read
	for i, notification := range MockNotifications {
		if notification["id"] == id {
			MockNotifications[i]["read"] = true
			
			c.JSON(http.StatusOK, gin.H{
				"message":      "Notification marked as read",
				"notification": MockNotifications[i],
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Notification not found"})
}

func handleMarkAllAsRead(c *gin.Context) {
	userId := c.Param("userId")
	
	// Find all user notifications and mark them as read
	var markedCount int
	for i, notification := range MockNotifications {
		if notification["user_id"] == userId && notification["read"] == false {
			MockNotifications[i]["read"] = true
			markedCount++
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "All notifications marked as read",
		"count":   markedCount,
	})
} 