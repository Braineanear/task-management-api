# Stage 1: Build the application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json, package-lock.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Stage 2: Create the final image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the built application and node_modules from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

# Expose the application port (if needed)
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/server"]
