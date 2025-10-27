FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install -g expo-cli && \
    npm install --force --legacy-peer-deps

# Copy source code
COPY . .

# Install curl for health checks (optional)
RUN apk add --no-cache curl

# Create a health check script
RUN echo '#!/bin/sh\ncurl -f http://localhost:19000 || exit 1' > /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Expose ports
EXPOSE 8081 19000 19001 19002 19006

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:19000', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application with more verbose logging
CMD ["npx", "expo", "start", "--tunnel", "--localhost"]