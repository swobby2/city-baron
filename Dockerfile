# ─── DOCKERFILE: City Baron ────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ openssl

# Copy package files
COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/client/package.json ./packages/client/

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN cd packages/server && npx prisma generate

# Build client
RUN cd packages/client && npx vite build

# ─── Production image ──────────────────────────
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Copy only what's needed
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/server ./packages/server
COPY --from=builder /app/packages/client/dist ./packages/client/dist

# Prisma already generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

# Start both server and serve client static files
CMD ["node", "packages/server/dist/main.js"]