# ---------- 0. Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- 1. Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Accept backend URL as build arg
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_JWT_PUBLIC_KEY
# Make sure it's visible to Next.js build
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_JWT_PUBLIC_KEY=${NEXT_PUBLIC_JWT_PUBLIC_KEY}

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Debug
RUN echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL"

# Build Next.js project
RUN pnpm build

# Prune dev dependencies
RUN pnpm prune --prod --ignore-scripts

# ---------- 2. Production ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set environment
ENV NODE_ENV=production

# Copy build artifacts and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Run as non-root user
USER node

# Start the app
CMD ["pnpm", "start"]
