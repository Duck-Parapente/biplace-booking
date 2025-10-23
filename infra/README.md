# Biplace Booking Infrastructure

This directory contains the infrastructure configuration for the Biplace Booking application.

## Quick Start

### Local Development (Recommended)
```bash
# From project root - starts DB and backend together
pnpm dev:backend

# Or manually:
# 1. Copy environment file
cp infra/env/.env.example infra/env/local/.env

# 2. Start database only
pnpm docker:local

# 3. Start backend with turbo
pnpm dev:backend
```

### Staging Deployment
```bash
# 1. Configure staging environment
cp infra/env/.env.example infra/env/staging/.env
# Edit infra/.env.staging with your staging values

# 2. Deploy to staging (builds with turbo first)
pnpm docker:staging
```

### Production Deployment
```bash
# 1. Configure production environment
cp infra/env/.env.example infra/env/prod/.env
# Edit infra/.env.prod with your production values

# 2. Deploy to production (builds with turbo first)
pnpm docker:prod
```

## Environment Files

- `local/.env` - Local development (database only, staging-level resources)
- `staging/.env` - Staging environment (176M total: 64M+80M+32M)
- `prod/.env` - Production environment (704M total: 256M+320M+128M)
- `.env.example` - Template file with all variables documented

### Resource Configuration

All resource limits are defined in environment files:

```bash
# Staging values (176M total)
POSTGRES_MEMORY_LIMIT=64M
BACKEND_MEMORY_LIMIT=80M
CADDY_MEMORY_LIMIT=32M

# Production values (704M total - 4x staging)
POSTGRES_MEMORY_LIMIT=256M
BACKEND_MEMORY_LIMIT=320M
CADDY_MEMORY_LIMIT=128M
```

**Important for 512MB servers**: Cannot run staging + production simultaneously!

## Caddy Configuration

- `staging/Caddyfile` - Staging with HTTPS
- `prod/Caddyfile` - Production with HTTPS

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
cd infra && ./restart-app.sh staging --force
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