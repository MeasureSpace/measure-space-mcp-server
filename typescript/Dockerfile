# syntax=docker/dockerfile:1
FROM node:22-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source and build
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Start the MCP server
CMD ["node", "dist/index.js"]
