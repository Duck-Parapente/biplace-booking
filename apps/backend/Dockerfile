FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV NODE_OPTIONS=--dns-result-order=ipv4first

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@8.15.4

# Copy backend workspace manifest only (avoid monorepo complexity)
COPY apps/backend/package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# Install dev + prod dependencies to build
RUN pnpm install --frozen-lockfile || pnpm install

# Copy Prisma config and schema, then generate client during build
COPY apps/backend/prisma.config.ts ./prisma.config.ts
COPY apps/backend/src/libs/database/prisma ./src/libs/database/prisma
RUN pnpm exec prisma generate

# Copy source & tsconfig
COPY apps/backend/tsconfig.json ./tsconfig.json
COPY apps/backend/src ./src

# Build (outputs dist/main.js)
RUN pnpm run build

FROM node:20-bookworm-slim AS prod
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@8.15.4
COPY apps/backend/package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# Copy Prisma config and schema before installing dependencies
COPY apps/backend/prisma.config.ts ./prisma.config.ts
COPY apps/backend/src/libs/database/prisma ./src/libs/database/prisma

# Install production dependencies (this will also postinstall prisma generate)
RUN pnpm install --frozen-lockfile --prod --no-optional || pnpm install --prod --no-optional

# Generate Prisma client in production stage
RUN pnpm exec prisma generate

COPY --from=build /app/dist ./dist
EXPOSE 3001
USER node
# Just run the app - migrations will be handled separately during deployment
CMD ["node", "dist/main.js"]