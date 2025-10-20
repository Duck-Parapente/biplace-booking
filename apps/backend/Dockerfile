FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV NODE_OPTIONS=--dns-result-order=ipv4first
RUN npm install -g pnpm@8.15.4

# Copy backend workspace manifest only (avoid monorepo complexity)
COPY apps/backend/package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# Install dev + prod dependencies to build
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source & tsconfig
COPY apps/backend/tsconfig.json ./tsconfig.json
COPY apps/backend/src ./src

# Build (outputs dist/main.js)
RUN pnpm run build

FROM node:20-bookworm-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm@8.15.4
COPY apps/backend/package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --prod --no-optional || pnpm install --prod --no-optional
COPY --from=build /app/dist ./dist
EXPOSE 3001
USER node
CMD ["node","dist/main.js"]