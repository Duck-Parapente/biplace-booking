# Biplace Booking Infrastructure

This directory contains the infrastructure configuration for the Biplace Booking application.

## Quick Start

### Local Development (Recommended)
```bash
# From project root - starts DB and backend together
pnpm dev:local

# Or manually:
# 1. Copy environment file
cp infra/.env.example infra/.env.local

# 2. Start database only
pnpm docker:local

# 3. Start backend with turbo
pnpm dev:backend
```

### Staging Deployment
```bash
# 1. Configure staging environment
cp infra/.env.example infra/.env.staging
# Edit infra/.env.staging with your staging values

# 2. Deploy to staging (builds with turbo first)
pnpm docker:staging
```

### Production Deployment
```bash
# 1. Configure production environment
cp infra/.env.example infra/.env.prod
# Edit infra/.env.prod with your production values

# 2. Deploy to production (builds with turbo first)
pnpm docker:prod
```

## Environment Files

- `.env.local` - Local development (database only)
- `.env.staging` - Staging environment
- `.env.prod` - Production environment
- `.env.example` - Template file

## Caddy Configuration

- `Caddyfile.local` - Local development (HTTP only)
- `Caddyfile.staging` - Staging with HTTPS
- `Caddyfile.prod` - Production with HTTPS

## DNS Records Required

For staging and production, add these A records:

| Environment | Record | Target |
|-------------|---------|---------|
| Staging | `api-staging.duckparapente.fr` | Your server IP |
| Production | `api.duckparapente.fr` | Your server IP |

## Commands

```bash
# 🚀 Recommended: Full local development
pnpm dev:local              # Starts DB + backend together

# 🐳 Docker commands
pnpm docker:local            # Start local development DB
pnpm docker:staging          # Deploy to staging
pnpm docker:prod             # Deploy to production

# 🐳 Force deployment (stops existing containers)
pnpm docker:local:force      # Force restart local DB
pnpm docker:staging:force    # Force deploy to staging
pnpm docker:prod:force       # Force deploy to production

# 🛑 Control commands
pnpm docker:down             # Stop all services
pnpm docker:logs             # View logs

# 🏗️ Development commands
pnpm dev:backend             # Start backend only (requires DB)
pnpm dev:frontend            # Start frontend only
pnpm dev                     # Start both frontend + backend
pnpm build                   # Build all apps with turbo

# 📦 Direct docker commands (if needed)
cd infra && ./deploy.sh local
cd infra && ./deploy.sh staging --force
cd infra && docker-compose up -d --build
```

## Architecture

### Local Development
- ✅ PostgreSQL in Docker
- ✅ Backend runs natively with turbo (`pnpm dev:backend`)
- ✅ No HTTPS (direct connection)
- ✅ Turbo handles rebuilds and hot reload

### Staging/Production
- ✅ PostgreSQL + Backend + Caddy in Docker
- ✅ Backend built with turbo before deployment
- ✅ Automatic HTTPS with Let's Encrypt
- ✅ Reverse proxy with security headers
- ✅ Automatic certificate renewal