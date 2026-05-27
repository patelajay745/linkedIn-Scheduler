# Stage 1: Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bunx prisma generate
RUN bun run build

# Stage 2: Production
FROM oven/bun:1-alpine AS production
WORKDIR /app

RUN bun add prisma --no-save



COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

USER bun

EXPOSE 8080

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run dist/index.js"]
