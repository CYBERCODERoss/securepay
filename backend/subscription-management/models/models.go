package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanInterval represents the billing interval for a subscription plan
type PlanInterval string

const (
	Monthly  PlanInterval = "monthly"
	Quarterly PlanInterval = "quarterly"
	Annual   PlanInterval = "annual"
)

// SubscriptionStatus represents the status of a subscription
type SubscriptionStatus string

const (
	Active    SubscriptionStatus = "active"
	Canceled  SubscriptionStatus = "canceled"
	Suspended SubscriptionStatus = "suspended"
	Expired   SubscriptionStatus = "expired"
	Trial     SubscriptionStatus = "trial"
)

// InvoiceStatus represents the status of an invoice
type InvoiceStatus string

const (
	Draft     InvoiceStatus = "draft"
	Open      InvoiceStatus = "open"
	Paid      InvoiceStatus = "paid"
	Overdue   InvoiceStatus = "overdue"
	Void      InvoiceStatus = "void"
	Canceled  InvoiceStatus = "canceled"
)

// Plan represents a subscription plan
type Plan struct {
	ID          string       `json:"id" pg:"id,pk"`
	Name        string       `json:"name" pg:"name,notnull"`
	Description string       `json:"description" pg:"description"`
	Amount      float64      `json:"amount" pg:"amount,notnull"`
	Currency    string       `json:"currency" pg:"currency,notnull"`
	Interval    PlanInterval `json:"interval" pg:"interval,notnull"`
	Features    []string     `json:"features" pg:"features,array"`
	IsActive    bool         `json:"is_active" pg:"is_active,notnull,default:true"`
	CreatedAt   time.Time    `json:"created_at" pg:"created_at,default:now()"`
	UpdatedAt   time.Time    `json:"updated_at" pg:"updated_at,default:now()"`
}

// Customer represents a customer who can subscribe to plans
type Customer struct {
	ID        string    `json:"id" pg:"id,pk"`
	Name      string    `json:"name" pg:"name,notnull"`
	Email     string    `json:"email" pg:"email,notnull,unique"`
	Phone     string    `json:"phone" pg:"phone"`
	Address   string    `json:"address" pg:"address"`
	City      string    `json:"city" pg:"city"`
	State     string    `json:"state" pg:"state"`
	Country   string    `json:"country" pg:"country"`
	ZipCode   string    `json:"zip_code" pg:"zip_code"`
	Metadata  map[string]interface{} `json:"metadata" pg:"metadata,type:jsonb"`
	CreatedAt time.Time `json:"created_at" pg:"created_at,default:now()"`
	UpdatedAt time.Time `json:"updated_at" pg:"updated_at,default:now()"`
}

// Subscription represents a customer's subscription to a plan
type Subscription struct {
	ID            string             `json:"id" pg:"id,pk"`
	CustomerID    string             `json:"customer_id" pg:"customer_id,notnull"`
	PlanID        string             `json:"plan_id" pg:"plan_id,notnull"`
	Status        SubscriptionStatus `json:"status" pg:"status,notnull"`
	CurrentPeriodStart time.Time     `json:"current_period_start" pg:"current_period_start,notnull"`
	CurrentPeriodEnd   time.Time     `json:"current_period_end" pg:"current_period_end,notnull"`
	CanceledAt    *time.Time         `json:"canceled_at,omitempty" pg:"canceled_at"`
	TrialStart    *time.Time         `json:"trial_start,omitempty" pg:"trial_start"`
	TrialEnd      *time.Time         `json:"trial_end,omitempty" pg:"trial_end"`
	Quantity      int                `json:"quantity" pg:"quantity,notnull,default:1"`
	Metadata      map[string]interface{} `json:"metadata" pg:"metadata,type:jsonb"`
	CreatedAt     time.Time          `json:"created_at" pg:"created_at,default:now()"`
	UpdatedAt     time.Time          `json:"updated_at" pg:"updated_at,default:now()"`
}

// Invoice represents a billing invoice for a subscription
type Invoice struct {
	ID              string         `json:"id" pg:"id,pk"`
	SubscriptionID  string         `json:"subscription_id" pg:"subscription_id,notnull"`
	CustomerID      string         `json:"customer_id" pg:"customer_id,notnull"`
	Amount          float64        `json:"amount" pg:"amount,notnull"`
	Currency        string         `json:"currency" pg:"currency,notnull"`
	Status          InvoiceStatus  `json:"status" pg:"status,notnull,default:'draft'"`
	DueDate         time.Time      `json:"due_date" pg:"due_date,notnull"`
	PaidAt          *time.Time     `json:"paid_at,omitempty" pg:"paid_at"`
	PeriodStart     time.Time      `json:"period_start" pg:"period_start,notnull"`
	PeriodEnd       time.Time      `json:"period_end" pg:"period_end,notnull"`
	Description     string         `json:"description" pg:"description"`
	Items           []InvoiceItem  `json:"items" pg:"items,type:jsonb"`
	Metadata        map[string]interface{} `json:"metadata" pg:"metadata,type:jsonb"`
	CreatedAt       time.Time      `json:"created_at" pg:"created_at,default:now()"`
	UpdatedAt       time.Time      `json:"updated_at" pg:"updated_at,default:now()"`
}

// InvoiceItem represents a line item on an invoice
type InvoiceItem struct {
	Description string  `json:"description"`
	Amount      float64 `json:"amount"`
	Quantity    int     `json:"quantity"`
} 