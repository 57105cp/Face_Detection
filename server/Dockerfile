# Use the Node.js 18 image based on Debian
FROM node:18-bullseye-slim

# Create and change to the /app directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
