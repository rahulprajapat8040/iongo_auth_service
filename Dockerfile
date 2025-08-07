# ********* BASE STAGE *********
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

# ********* BUILD STAGE ********
FROM base AS builder
COPY . .
RUN npm run build

# ********* PRODUCTION STAGE *********
FROM node:20-alpine AS production
WORKDIR /app

# Copy only what's needed
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

# Expose a default port (but overridden by env var in compose)
EXPOSE 3000
EXPOSE 3001

# Start the app
CMD ["node", "dist/main"]
