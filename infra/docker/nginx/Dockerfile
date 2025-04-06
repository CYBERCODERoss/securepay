FROM nginx:alpine

# Install necessary tools
RUN apk add --no-cache openssl

# Create directories for SSL certificates
RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Generate self-signed SSL certificate for development
# In production, this should be replaced with a proper certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/securepay.key \
    -out /etc/ssl/certs/securepay.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=securepay.example.com"

# Create directory for static files
RUN mkdir -p /usr/share/nginx/html

# Create a default static file
RUN echo "SecurePay is being set up..." > /usr/share/nginx/html/index.html

# For better security, run as non-root
RUN addgroup -g 1000 nginx-group && \
    adduser -u 1000 -G nginx-group -D -H nginx-user && \
    chown -R nginx-user:nginx-group /etc/nginx /var/cache/nginx /var/log/nginx /etc/ssl /usr/share/nginx/html

# Switch to non-root user
USER nginx-user

# Expose ports
EXPOSE 80 443

# Start NGINX
CMD ["nginx", "-g", "daemon off;"] 