import os
import logging
import uvicorn
import joblib
import numpy as np
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Union
from datetime import datetime
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Prometheus metrics
FRAUD_DETECTION_COUNTER = Counter(
    "fraud_detection_total", 
    "Total number of fraud detection requests",
    ["result"]
)
DETECTION_LATENCY = Histogram(
    "fraud_detection_latency_seconds", 
    "Fraud detection latency in seconds"
)

# Initialize FastAPI
app = FastAPI(
    title="SecurePay Fraud Detection Service",
    description="Microservice for real-time fraud detection in payment transactions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model (will be replaced with actual model loading in production)
# In production, the model would be loaded from a specific path
model = None
try:
    # This is a placeholder - in a real scenario we'd load a trained model
    # model = joblib.load("models/fraud_detection_model.pkl")
    logger.info("Model initialized")
except Exception as e:
    logger.error(f"Error loading model: {e}")

# Define request/response models
class TransactionData(BaseModel):
    transaction_id: str
    amount: float
    currency: str
    payment_method: str
    customer_id: str
    merchant_id: str
    timestamp: str
    ip_address: Optional[str] = None
    device_id: Optional[str] = None
    location: Optional[Dict[str, float]] = None  # lat, long
    previous_transactions_count: Optional[int] = None
    average_transaction_amount: Optional[float] = None
    user_account_age_days: Optional[int] = None

class FraudPredictionResponse(BaseModel):
    transaction_id: str
    fraud_probability: float
    is_fraudulent: bool
    risk_score: int
    risk_factors: List[str]
    timestamp: str

# Feature engineering functions
def engineer_features(transaction: TransactionData):
    # This would be replaced with actual feature engineering
    # based on your fraud detection model requirements
    features = {
        "amount": transaction.amount,
        "hour_of_day": datetime.fromisoformat(transaction.timestamp).hour,
        "is_high_amount": 1 if transaction.amount > 1000 else 0,
        "is_new_customer": 1 if transaction.previous_transactions_count is None or transaction.previous_transactions_count < 3 else 0,
        # Add more engineered features as needed
    }
    return features

def get_risk_factors(transaction: TransactionData, fraud_probability: float):
    # Logic to determine risk factors
    risk_factors = []
    
    if transaction.amount > 1000:
        risk_factors.append("Unusually high transaction amount")
    
    if transaction.previous_transactions_count is not None and transaction.previous_transactions_count < 3:
        risk_factors.append("New customer with limited history")
    
    if transaction.user_account_age_days is not None and transaction.user_account_age_days < 7:
        risk_factors.append("Recently created account")
        
    # Add more risk factor logic as needed
    
    return risk_factors

@app.get("/health")
async def health_check():
    if model is None:
        return {"status": "warning", "message": "Service running but model not loaded"}
    return {"status": "ok", "message": "Service is healthy"}

@app.get("/metrics")
async def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/predict", response_model=FraudPredictionResponse)
async def predict_fraud(transaction: TransactionData):
    logger.info(f"Processing transaction {transaction.transaction_id}")
    
    with DETECTION_LATENCY.time():
        try:
            # Feature engineering
            features = engineer_features(transaction)
            
            # In a real scenario, we would use the model to predict
            # For now, we'll use a simple heuristic
            # The real implementation would look like:
            # fraud_probability = model.predict_proba([list(features.values())])[0][1]
            
            # Simple placeholder logic - to be replaced with actual model inference
            fraud_probability = 0.1  # Default low probability
            if transaction.amount > 5000:
                fraud_probability += 0.3
            if transaction.previous_transactions_count is not None and transaction.previous_transactions_count < 2:
                fraud_probability += 0.2
            if transaction.user_account_age_days is not None and transaction.user_account_age_days < 5:
                fraud_probability += 0.2
                
            # Apply rules
            is_fraudulent = fraud_probability > 0.6
            
            # Calculate risk score (0-100)
            risk_score = min(int(fraud_probability * 100), 100)
            
            # Get risk factors
            risk_factors = get_risk_factors(transaction, fraud_probability)
            
            # Record the prediction to metrics
            FRAUD_DETECTION_COUNTER.labels(
                result="fraud" if is_fraudulent else "legitimate"
            ).inc()
            
            response = FraudPredictionResponse(
                transaction_id=transaction.transaction_id,
                fraud_probability=round(fraud_probability, 3),
                is_fraudulent=is_fraudulent,
                risk_score=risk_score,
                risk_factors=risk_factors,
                timestamp=datetime.now().isoformat()
            )
            
            logger.info(f"Transaction {transaction.transaction_id} - fraud probability: {fraud_probability}")
            if is_fraudulent:
                logger.warning(f"Potential fraud detected for transaction {transaction.transaction_id}")
                
            return response
            
        except Exception as e:
            logger.error(f"Error processing transaction {transaction.transaction_id}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Error processing request: {str(e)}"
            )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8085"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True) 