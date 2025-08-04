# --------- BASE STAGE -----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

# --------- BUILD STAGE --------
FROM base AS builder
COPY . .
RUN npm run build

# --------- PRODUCTION STAGE --------
FROM node:20-alpine AS production
WORKDIR /app

# Copy node_modules and dist from builder/base
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

# EXPOSE PORTS
EXPOSE 3000
EXPOSE 3001

CMD ["node", "dist/main"]
