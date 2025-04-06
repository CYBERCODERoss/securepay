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

// MockUsers represents a simple in-memory user store for demonstration
var MockUsers = []gin.H{
	{
		"id":           "usr_1",
		"email":        "john@example.com",
		"name":         "John Doe",
		"created_at":   "2023-01-15T10:30:00Z",
		"account_type": "business",
		"status":       "active",
		"company":      "Acme Inc.",
	},
	{
		"id":           "usr_2",
		"email":        "jane@example.com",
		"name":         "Jane Smith",
		"created_at":   "2023-02-20T14:45:00Z",
		"account_type": "individual",
		"status":       "active",
		"company":      "",
	},
	{
		"id":           "usr_3",
		"email":        "robert@example.com",
		"name":         "Robert Johnson",
		"created_at":   "2023-03-10T09:15:00Z",
		"account_type": "business",
		"status":       "active",
		"company":      "XYZ Corp",
	},
	{
		"id":           "usr_4",
		"email":        "emily@example.com",
		"name":         "Emily Davis",
		"created_at":   "2023-04-01T16:20:00Z",
		"account_type": "individual",
		"status":       "inactive",
		"company":      "",
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
			"service": "user-service",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// User endpoints
	r.GET("/", handleListUsers)
	r.GET("/:id", handleGetUser)
	r.PUT("/:id", handleUpdateUser)
	r.POST("/", handleCreateUser)
	r.PUT("/:id/deactivate", handleDeactivateUser)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4004"
	}

	log.Printf("User Service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start User Service: %v", err)
	}
}

func handleListUsers(c *gin.Context) {
	// Filter by status if provided
	status := c.Query("status")
	if status != "" {
		var filteredUsers []gin.H
		for _, user := range MockUsers {
			if user["status"] == status {
				filteredUsers = append(filteredUsers, user)
			}
		}
		
		c.JSON(http.StatusOK, gin.H{
			"users": filteredUsers,
			"count": len(filteredUsers),
		})
		return
	}
	
	// Return all users
	c.JSON(http.StatusOK, gin.H{
		"users": MockUsers,
		"count": len(MockUsers),
	})
}

func handleGetUser(c *gin.Context) {
	id := c.Param("id")

	// Search for the user
	for _, user := range MockUsers {
		if user["id"] == id {
			c.JSON(http.StatusOK, gin.H{
				"user": user,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

func handleUpdateUser(c *gin.Context) {
	id := c.Param("id")
	
	var updateRequest struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Company string `json:"company"`
	}

	if err := c.ShouldBindJSON(&updateRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Find and update the user
	for i, user := range MockUsers {
		if user["id"] == id {
			// Update fields
			if updateRequest.Name != "" {
				MockUsers[i]["name"] = updateRequest.Name
			}
			
			if updateRequest.Email != "" {
				MockUsers[i]["email"] = updateRequest.Email
			}
			
			if updateRequest.Company != "" {
				MockUsers[i]["company"] = updateRequest.Company
			}
			
			c.JSON(http.StatusOK, gin.H{
				"message": "User updated successfully",
				"user":    MockUsers[i],
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

func handleCreateUser(c *gin.Context) {
	var createRequest struct {
		Name        string `json:"name" binding:"required"`
		Email       string `json:"email" binding:"required,email"`
		AccountType string `json:"account_type" binding:"required"`
		Company     string `json:"company"`
	}

	if err := c.ShouldBindJSON(&createRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Create a new user
	userId := "usr_" + uuid.New().String()[:8]
	
	newUser := gin.H{
		"id":           userId,
		"email":        createRequest.Email,
		"name":         createRequest.Name,
		"created_at":   time.Now().Format(time.RFC3339),
		"account_type": createRequest.AccountType,
		"status":       "active",
		"company":      createRequest.Company,
	}
	
	// Add to mock users
	MockUsers = append(MockUsers, newUser)
	
	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    newUser,
	})
}

func handleDeactivateUser(c *gin.Context) {
	id := c.Param("id")

	// Find and deactivate the user
	for i, user := range MockUsers {
		if user["id"] == id {
			MockUsers[i]["status"] = "inactive"
			
			c.JSON(http.StatusOK, gin.H{
				"message": "User deactivated successfully",
				"user":    MockUsers[i],
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
} 