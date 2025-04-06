package main

import (
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// MockRiskScores represents a simple in-memory risk score store
var MockRiskScores = []gin.H{
	{
		"id":          "risk_1",
		"transaction_id": "txn_1",
		"user_id":     "usr_1",
		"score":       15, // Low risk (0-100 scale)
		"factors":     []string{"verified_user", "common_ip_address", "known_device"},
		"decision":    "allow",
		"created_at":  "2023-04-06T10:30:00Z",
	},
	{
		"id":          "risk_2",
		"transaction_id": "txn_2",
		"user_id":     "usr_2",
		"score":       25,
		"factors":     []string{"verified_user", "unusual_location", "known_device"},
		"decision":    "allow",
		"created_at":  "2023-04-05T14:20:00Z",
	},
	{
		"id":          "risk_3",
		"transaction_id": "txn_3",
		"user_id":     "usr_3",
		"score":       75, // High risk
		"factors":     []string{"new_user", "unusual_amount", "suspicious_ip_address"},
		"decision":    "review",
		"created_at":  "2023-04-06T09:15:00Z",
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
			"service": "fraud-detection-service",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Fraud detection endpoints
	r.POST("/analyze", handleAnalyzeTransaction)
	r.GET("/transaction/:transactionId", handleGetTransactionRisk)
	r.GET("/user/:userId", handleGetUserRiskHistory)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4006"
	}

	log.Printf("Fraud Detection Service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start Fraud Detection Service: %v", err)
	}
}

func handleAnalyzeTransaction(c *gin.Context) {
	var request struct {
		TransactionId string  `json:"transaction_id" binding:"required"`
		UserId        string  `json:"user_id" binding:"required"`
		Amount        float64 `json:"amount" binding:"required"`
		Currency      string  `json:"currency" binding:"required"`
		IpAddress     string  `json:"ip_address"`
		DeviceId      string  `json:"device_id"`
		Location      string  `json:"location"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// In a real system, perform actual fraud detection analysis
	// For demo purposes, we'll generate a random risk score and decision
	
	// Seed the random number generator
	rand.Seed(time.Now().UnixNano())
	
	// Generate a risk score between 0 and 100
	riskScore := rand.Intn(101)
	
	// Determine factors that contribute to the risk score
	factors := []string{}
	
	// Add some randomized factors
	if rand.Intn(2) == 1 {
		factors = append(factors, "verified_user")
	} else {
		factors = append(factors, "new_user")
	}
	
	if request.Amount > 1000 {
		factors = append(factors, "high_amount")
	}
	
	if rand.Intn(2) == 1 {
		factors = append(factors, "common_ip_address")
	} else {
		factors = append(factors, "unusual_ip_address")
	}
	
	// Determine decision based on risk score
	var decision string
	if riskScore < 30 {
		decision = "allow"
	} else if riskScore < 70 {
		decision = "review"
	} else {
		decision = "deny"
	}
	
	// Create risk assessment record
	riskId := "risk_" + uuid.New().String()[:8]
	riskAssessment := gin.H{
		"id":             riskId,
		"transaction_id": request.TransactionId,
		"user_id":        request.UserId,
		"score":          riskScore,
		"factors":        factors,
		"decision":       decision,
		"created_at":     time.Now().Format(time.RFC3339),
	}
	
	// Add to mock risk scores
	MockRiskScores = append(MockRiskScores, riskAssessment)
	
	c.JSON(http.StatusOK, gin.H{
		"risk_assessment": riskAssessment,
	})
}

func handleGetTransactionRisk(c *gin.Context) {
	transactionId := c.Param("transactionId")
	
	// Find risk assessment for the transaction
	for _, risk := range MockRiskScores {
		if risk["transaction_id"] == transactionId {
			c.JSON(http.StatusOK, gin.H{
				"risk_assessment": risk,
			})
			return
		}
	}
	
	c.JSON(http.StatusNotFound, gin.H{"error": "Risk assessment not found for this transaction"})
}

func handleGetUserRiskHistory(c *gin.Context) {
	userId := c.Param("userId")
	
	// Find all risk assessments for the user
	var userRiskHistory []gin.H
	for _, risk := range MockRiskScores {
		if risk["user_id"] == userId {
			userRiskHistory = append(userRiskHistory, risk)
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"risk_history": userRiskHistory,
		"count":        len(userRiskHistory),
	})
} 