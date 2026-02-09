# syntax=docker/dockerfile:1
# ---- Dependencies stage ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# ---- Production image ----
FROM node:22-alpine AS runner
WORKDIR /app

# Create non-root user with fixed UID for consistency
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copy production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .

# Ensure app files are readable by appuser (write not required at runtime)
RUN chown -R appuser:appgroup /app

ENV NODE_ENV=production
EXPOSE 5000

USER appuser

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "index.js"]
