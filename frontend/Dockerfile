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

# Build the React app
RUN npm install -g npm@9.8.1
RUN npm run build

EXPOSE 80

# Set the command to start the React app
CMD ["npm", "start"]
# CMD [ "npm", "run", "dev" ]
