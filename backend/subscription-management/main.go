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

// MockSubscriptions represents a simple in-memory subscription store
var MockSubscriptions = []gin.H{
	{
		"id":             "sub_1",
		"customer_id":    "usr_1",
		"plan_id":        "plan_premium",
		"plan_name":      "Premium Plan",
		"amount":         49.99,
		"currency":       "USD",
		"interval":       "monthly",
		"status":         "active",
		"start_date":     "2023-01-15T00:00:00Z",
		"current_period_end": "2023-05-15T00:00:00Z",
		"created_at":     "2023-01-15T10:30:00Z",
	},
	{
		"id":             "sub_2",
		"customer_id":    "usr_2",
		"plan_id":        "plan_basic",
		"plan_name":      "Basic Plan",
		"amount":         19.99,
		"currency":       "USD",
		"interval":       "monthly",
		"status":         "active",
		"start_date":     "2023-02-20T00:00:00Z",
		"current_period_end": "2023-05-20T00:00:00Z",
		"created_at":     "2023-02-20T14:45:00Z",
	},
	{
		"id":             "sub_3",
		"customer_id":    "usr_3",
		"plan_id":        "plan_enterprise",
		"plan_name":      "Enterprise Plan",
		"amount":         299.99,
		"currency":       "USD",
		"interval":       "yearly",
		"status":         "active",
		"start_date":     "2023-03-10T00:00:00Z",
		"current_period_end": "2024-03-10T00:00:00Z",
		"created_at":     "2023-03-10T09:15:00Z",
	},
}

// MockPlans represents available subscription plans
var MockPlans = []gin.H{
	{
		"id":          "plan_basic",
		"name":        "Basic Plan",
		"description": "For small businesses just getting started",
		"amount":      19.99,
		"currency":    "USD",
		"interval":    "monthly",
		"features":    []string{"Standard Payment Processing", "Basic Reporting", "Email Support"},
	},
	{
		"id":          "plan_premium",
		"name":        "Premium Plan",
		"description": "For growing businesses with higher volume",
		"amount":      49.99,
		"currency":    "USD",
		"interval":    "monthly",
		"features":    []string{"Advanced Payment Processing", "Detailed Analytics", "Priority Support", "Fraud Protection"},
	},
	{
		"id":          "plan_enterprise",
		"name":        "Enterprise Plan",
		"description": "For large businesses with specialized needs",
		"amount":      299.99,
		"currency":    "USD",
		"interval":    "yearly",
		"features":    []string{"Custom Payment Solutions", "Advanced Analytics", "Dedicated Account Manager", "Premium Fraud Protection", "Custom Integrations"},
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
			"service": "subscription-service",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Subscription endpoints
	r.GET("/plans", handleListPlans)
	r.GET("/customer/:customerId", handleGetCustomerSubscriptions)
	r.POST("/subscribe", handleCreateSubscription)
	r.PUT("/:id/cancel", handleCancelSubscription)
	r.PUT("/:id/upgrade", handleUpgradeSubscription)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4007"
	}

	log.Printf("Subscription Service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start Subscription Service: %v", err)
	}
}

func handleListPlans(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"plans": MockPlans,
	})
}

func handleGetCustomerSubscriptions(c *gin.Context) {
	customerId := c.Param("customerId")
	
	// Filter subscriptions by customer ID
	var customerSubscriptions []gin.H
	for _, subscription := range MockSubscriptions {
		if subscription["customer_id"] == customerId {
			customerSubscriptions = append(customerSubscriptions, subscription)
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"subscriptions": customerSubscriptions,
		"count":         len(customerSubscriptions),
	})
}

func handleCreateSubscription(c *gin.Context) {
	var request struct {
		CustomerId string `json:"customer_id" binding:"required"`
		PlanId     string `json:"plan_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Verify that the plan exists
	var selectedPlan gin.H
	planFound := false
	for _, plan := range MockPlans {
		if plan["id"] == request.PlanId {
			selectedPlan = plan
			planFound = true
			break
		}
	}
	
	if !planFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "Plan not found"})
		return
	}
	
	// Create subscription start date and end date based on interval
	startDate := time.Now()
	var endDate time.Time
	
	if selectedPlan["interval"] == "monthly" {
		endDate = startDate.AddDate(0, 1, 0)
	} else if selectedPlan["interval"] == "yearly" {
		endDate = startDate.AddDate(1, 0, 0)
	} else {
		// Default to monthly
		endDate = startDate.AddDate(0, 1, 0)
	}
	
	// Create a new subscription
	subscriptionId := "sub_" + uuid.New().String()[:8]
	
	newSubscription := gin.H{
		"id":                 subscriptionId,
		"customer_id":        request.CustomerId,
		"plan_id":            selectedPlan["id"],
		"plan_name":          selectedPlan["name"],
		"amount":             selectedPlan["amount"],
		"currency":           selectedPlan["currency"],
		"interval":           selectedPlan["interval"],
		"status":             "active",
		"start_date":         startDate.Format(time.RFC3339),
		"current_period_end": endDate.Format(time.RFC3339),
		"created_at":         time.Now().Format(time.RFC3339),
	}
	
	// Add to mock subscriptions
	MockSubscriptions = append(MockSubscriptions, newSubscription)
	
	c.JSON(http.StatusCreated, gin.H{
		"message":      "Subscription created successfully",
		"subscription": newSubscription,
	})
}

func handleCancelSubscription(c *gin.Context) {
	id := c.Param("id")

	// Find and cancel the subscription
	for i, subscription := range MockSubscriptions {
		if subscription["id"] == id {
			MockSubscriptions[i]["status"] = "cancelled"
			
			c.JSON(http.StatusOK, gin.H{
				"message":      "Subscription cancelled successfully",
				"subscription": MockSubscriptions[i],
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Subscription not found"})
}

func handleUpgradeSubscription(c *gin.Context) {
	id := c.Param("id")
	
	var request struct {
		PlanId string `json:"plan_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Verify that the plan exists
	var selectedPlan gin.H
	planFound := false
	for _, plan := range MockPlans {
		if plan["id"] == request.PlanId {
			selectedPlan = plan
			planFound = true
			break
		}
	}
	
	if !planFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "Plan not found"})
		return
	}

	// Find and upgrade the subscription
	for i, subscription := range MockSubscriptions {
		if subscription["id"] == id {
			// Update plan details
			MockSubscriptions[i]["plan_id"] = selectedPlan["id"]
			MockSubscriptions[i]["plan_name"] = selectedPlan["name"]
			MockSubscriptions[i]["amount"] = selectedPlan["amount"]
			MockSubscriptions[i]["interval"] = selectedPlan["interval"]
			
			c.JSON(http.StatusOK, gin.H{
				"message":      "Subscription upgraded successfully",
				"subscription": MockSubscriptions[i],
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Subscription not found"})
}