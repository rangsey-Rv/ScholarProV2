# ---------- 0. Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# ---------- 1. Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Accept runtime env variables for build-time configuration
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_JWT_PUBLIC_KEY
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_JWT_PUBLIC_KEY=${NEXT_PUBLIC_JWT_PUBLIC_KEY}

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build Next.js project
RUN npm run build

# Prune dev dependencies
RUN npm prune --omit=dev

# ---------- 2. Production ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy build artifacts and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Run as non-root user
USER node

# Start the app
CMD ["npm", "start"]
