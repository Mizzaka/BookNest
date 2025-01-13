# Use node 16-alpine as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the project files
COPY . .

# Build the frontend app
RUN npm run build

# Expose the port that the frontend will run on
EXPOSE 3000

# Command to start the app in production mode
CMD ["npm", "start"]
