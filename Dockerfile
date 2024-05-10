# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN yarn install

# Copy the rest of the application source code to the container
COPY . .

# Generate prisma
RUN npx prisma generate

# Command to start your Nest.js application
CMD [ "yarn", "start"]