FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["node","index.js"]
# Use official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port your app runs on
EXPOSE 4000

# Start the app
CMD ["node", "index.js"]
