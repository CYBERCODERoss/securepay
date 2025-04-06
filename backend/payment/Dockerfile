FROM golang:1.21-alpine as builder

WORKDIR /app

# Copy source code
COPY . .

# Download dependencies
RUN go mod tidy

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o paymentservice .

# Use a small alpine image
FROM alpine:3.19

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/paymentservice .

# Expose API port
EXPOSE 4002

# Command to run the application
CMD ["./paymentservice"] 