FROM node:20-bookworm-slim AS build
WORKDIR /app
# Do not set NODE_ENV=production in build stage so devDependencies (typescript) are installed
ENV NODE_OPTIONS=--dns-result-order=ipv4first
# Install pnpm
RUN npm install -g pnpm@8.15.4

# Copy only manifests first (improves layer cache hit when source changes)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json apps/backend/package.json

# Use a faster registry if needed (optional) and install only backend workspace deps
RUN pnpm config set registry https://registry.npmmirror.com \
	&& pnpm install --frozen-lockfile --filter=./apps/backend... --unsafe-perm --prod=false

# Copy backend source (avoid copying unrelated workspaces so install layer stays cached)
COPY apps/backend/tsconfig.json apps/backend/tsconfig.json
COPY apps/backend/src apps/backend/src

# Build just the backend (avoid turbo overhead; directly invoke its script)
RUN pnpm --filter=./apps/backend build

# Prune dev dependencies only for backend workspace (avoid wiping all since root has none)
RUN pnpm prune --prod --filter=./apps/backend
FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./dist
EXPOSE 3001
USER node