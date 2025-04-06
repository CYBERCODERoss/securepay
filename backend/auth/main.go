package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// MockUsers represents a simple in-memory user store for demonstration
var MockUsers = []gin.H{
	{
		"id":       "usr_1",
		"username": "demo@example.com",
		"email":    "demo@example.com",
		"name":     "Demo User",
		"role":     "admin",
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
			"service": "auth-service",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Auth endpoints
	r.POST("/login", handleLogin)
	r.POST("/register", handleRegister)
	r.POST("/logout", handleLogout)
	r.GET("/user", handleGetUser)
	r.POST("/refresh", handleRefreshToken)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4001"
	}

	log.Printf("Auth Service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start Auth Service: %v", err)
	}
}

func handleLogin(c *gin.Context) {
	var loginRequest struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// For demo purposes, accept any login with valid format
	if loginRequest.Email != "" && loginRequest.Password != "" {
		// Generate mock tokens
		c.JSON(http.StatusOK, gin.H{
			"message":      "Login successful",
			"access_token": "mock_access_token_" + time.Now().Format(time.RFC3339),
			"refresh_token": "mock_refresh_token_" + time.Now().Format(time.RFC3339),
			"user": MockUsers[0],
			"expires_in": 3600,
		})
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
}

func handleRegister(c *gin.Context) {
	var registerRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=8"`
		Name     string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&registerRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// For demo purposes, always succeed
	c.JSON(http.StatusCreated, gin.H{
		"message": "Registration successful",
		"user": gin.H{
			"id":    "usr_" + time.Now().Format("20060102150405"),
			"email": registerRequest.Email,
			"name":  registerRequest.Name,
		},
	})
}

func handleLogout(c *gin.Context) {
	// For demo purposes, always succeed
	c.JSON(http.StatusOK, gin.H{
		"message": "Logout successful",
	})
}

func handleGetUser(c *gin.Context) {
	// Just return the mock user
	c.JSON(http.StatusOK, gin.H{
		"user": MockUsers[0],
	})
}

func handleRefreshToken(c *gin.Context) {
	// For demo purposes, always return a new token
	c.JSON(http.StatusOK, gin.H{
		"access_token":  "mock_access_token_" + time.Now().Format(time.RFC3339),
		"refresh_token": "mock_refresh_token_" + time.Now().Format(time.RFC3339),
		"expires_in":    3600,
	})
} 