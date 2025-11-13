FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV NODE_OPTIONS=--dns-result-order=ipv4first

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@8.15.4

# Copy workspace configuration
COPY package.json ./package.json
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# Copy package.json files for workspace packages
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# Install dev + prod dependencies to build
RUN pnpm install --frozen-lockfile || pnpm install

# Copy Prisma config and schema, then generate client during build
COPY apps/backend/prisma.config.ts ./apps/backend/prisma.config.ts
COPY apps/backend/src/libs/database/prisma ./apps/backend/src/libs/database/prisma
RUN cd apps/backend && pnpm exec prisma generate

# Copy shared package source
COPY packages/shared ./packages/shared
RUN cd packages/shared && pnpm run build

# Copy backend source & tsconfig
COPY apps/backend/tsconfig.json ./apps/backend/tsconfig.json
COPY apps/backend/src ./apps/backend/src

# Build backend (outputs dist/main.js)
RUN cd apps/backend && pnpm run build

FROM node:20-bookworm-slim AS prod
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@8.15.4

# Copy workspace configuration
COPY package.json ./package.json
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# Copy package.json files for workspace packages
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# Copy Prisma config and schema before installing dependencies
COPY apps/backend/prisma.config.ts ./apps/backend/prisma.config.ts
COPY apps/backend/src/libs/database/prisma ./apps/backend/src/libs/database/prisma

# Install production dependencies (this will also postinstall prisma generate)
RUN pnpm install --frozen-lockfile --prod --no-optional || pnpm install --prod --no-optional

# Generate Prisma client in production stage
RUN cd apps/backend && pnpm exec prisma generate

# Copy built shared package from build stage
COPY --from=build /app/packages/shared/dist ./packages/shared/dist

# Copy built backend from build stage
COPY --from=build /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3001
WORKDIR /app/apps/backend
USER node
CMD ["pnpm", "start:prod"]