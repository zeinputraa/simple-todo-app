FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies dengan options untuk handle peer dependencies
RUN npm install -g expo-cli @expo/ngrok && \
    npm install --force --legacy-peer-deps

# Copy source code
COPY . .

# Install system dependencies untuk React Native
RUN apk add --no-cache curl

# Expose ports
EXPOSE 8081 19000 19001 19002 19006

# Start the application dengan options
CMD ["npx", "expo", "start", "--tunnel"]