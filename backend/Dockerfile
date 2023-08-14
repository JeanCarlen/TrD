# Use the official Node.js image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

EXPOSE 3001

# Set the command to start the Nestjs app
CMD ["npm", "start"]
