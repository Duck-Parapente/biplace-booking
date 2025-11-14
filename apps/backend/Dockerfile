FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV NODE_OPTIONS=--dns-result-order=ipv4first

# Enable corepack and set pnpm version
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Install OpenSSL (needed for Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Workspace package.json files (for caching)
COPY apps/backend/package.json apps/backend/
COPY packages/shared/package.json packages/shared/

# Install full deps (dev + prod) for building
RUN pnpm install --frozen-lockfile

# Copy full source after installing deps (to leverage Docker cache)
COPY packages/shared packages/shared
COPY apps/backend apps/backend

# Generate Prisma client
RUN pnpm -C apps/backend exec prisma generate

# Build workspace
RUN pnpm -C packages/shared build
RUN pnpm -C apps/backend build

# Prune dev dependencies to create production node_modules
RUN pnpm prune --prod

# -------------------------------
# Production image
# -------------------------------
FROM node:20-bookworm-slim AS prod
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy everything from build stage (includes node_modules, built artifacts, prisma files)
COPY --from=build /app ./

EXPOSE 3001
USER node
CMD ["pnpm", "-C", "apps/backend", "start:prod"]
