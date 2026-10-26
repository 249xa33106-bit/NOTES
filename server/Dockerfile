# ==========================================
# Backend API & Sandbox Execution Service
# ==========================================
FROM node:20-alpine

# Install Python3 for sandboxed code execution
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server code
COPY server/ ./server/

# Environment variables
ENV NODE_ENV=production \
    PORT=3001

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "server/index.js"]
