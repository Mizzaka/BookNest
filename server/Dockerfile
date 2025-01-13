# Use Node 16 or 18 as a base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies, forcing bcrypt to build from source
RUN npm install bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
