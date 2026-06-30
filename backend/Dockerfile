# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies (required for build steps like tsc and sentry-cli)
RUN npm install

# Define build arguments
ARG NODE_ENV=production

# Set environment variables for the build process ONLY
ENV NODE_ENV=$NODE_ENV

# Copy source code and perform build
COPY . .
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
    npm run build

# Stage 2: Create the final production image
FROM node:20-alpine

WORKDIR /app

# Set runtime environment
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy only the compiled code from the builder stage
COPY --from=builder /app/dist ./dist

# SENTRY_AUTH_TOKEN is not defined here, so it won't leak in image metadata
# Ports
EXPOSE 3000

# Production-ready execution
CMD ["node", "dist/index.js"]