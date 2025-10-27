FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install -g expo-cli
RUN npm install

# Copy source code
COPY . .

# Expose ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19006

# Start the application
CMD ["npm", "start"]