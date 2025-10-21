#!/bin/bash

# Deployment script for Biplace Booking
# Usage: ./deploy.sh [local|staging|prod] [--force]

ENV=${1:-local}
FORCE_FLAG=$2

echo "🚀 Deploying Biplace Booking in $ENV environment..."

# Validate environment
if [[ ! "$ENV" =~ ^(local|staging|prod)$ ]]; then
    echo "❌ Invalid environment: $ENV"
    echo "Usage: ./deploy.sh [local|staging|prod] [--force]"
    echo "  --force: Stop running containers without asking"
    exit 1
fi

# Check if .env file exists
if [[ ! -f ".env.$ENV" ]]; then
    echo "❌ Environment file .env.$ENV not found!"
    exit 1
fi

# Source the environment file to load variables
set -a  # automatically export all variables
source ".env.$ENV"
set +a  # stop automatically exporting

# Export environment
export ENV=$ENV

echo "📋 Environment: $ENV"
echo "📄 Using config: .env.$ENV"

# Check for running containers
RUNNING_CONTAINERS=$(docker-compose ps -q)
if [[ -n "$RUNNING_CONTAINERS" ]]; then
    echo "⚠️  Found running containers:"
    docker-compose ps --format "table {{.Name}}\t{{.State}}\t{{.Ports}}"
    echo ""
    
    if [[ "$FORCE_FLAG" == "--force" ]]; then
        echo "🛑 Force flag detected, stopping containers..."
        docker-compose down
        echo "✅ Containers stopped"
    else
        echo "🛑 Stop existing containers? (y/N)"
        read -r stop_containers
        if [[ $stop_containers == [yY] ]]; then
            echo "🛑 Stopping existing containers..."
            docker-compose down
            echo "✅ Containers stopped"
        else
            echo "❌ Deployment cancelled. Please stop containers manually:"
            echo "   docker-compose down"
            echo "   Or use: ./deploy.sh $ENV --force"
            exit 1
        fi
    fi
fi

case $ENV in
    "local")
        echo "🔧 Starting local development environment..."
        echo "   - Database only (no backend container)"
        echo "   - Backend should be run with: pnpm dev:backend"
        
        # Start only postgres with local profile
        if docker-compose --profile local up -d postgres; then
            echo "✅ PostgreSQL is running on port 5432"
            echo "💡 Start your backend with: pnpm dev:backend"
        else
            echo "❌ Failed to start PostgreSQL"
            exit 1
        fi
        ;;
    "staging")
        echo "🧪 Deploying to staging environment..."
        echo "📦 Building backend with turbo..."
        
        # Build first, then deploy
        if cd ../../ && pnpm build --filter=backend && cd infra; then
            echo "✅ Build successful"
            if docker-compose --profile staging up -d --build; then
                echo "✅ Staging deployed!"
                echo "🌐 API available at: https://api-staging.duckparapente.fr"
            else
                echo "❌ Failed to deploy staging environment"
                exit 1
            fi
        else
            echo "❌ Build failed"
            exit 1
        fi
        ;;
    "prod")
        echo "🏭 Deploying to production environment..."
        echo "⚠️  This will deploy to production. Continue? (y/N)"
        read -r confirm
        if [[ $confirm != [yY] ]]; then
            echo "❌ Production deployment cancelled"
            exit 1
        fi
        echo "📦 Building backend with turbo..."
        
        # Build first, then deploy
        if cd ../../ && pnpm build --filter=backend && cd infra; then
            echo "✅ Build successful"
            if docker-compose --profile prod up -d --build; then
                echo "✅ Production deployed!"
                echo "🌐 API available at: https://api.duckparapente.fr"
            else
                echo "❌ Failed to deploy production environment"
                exit 1
            fi
        else
            echo "❌ Build failed"
            exit 1
        fi
        ;;
esac

echo "📊 Container status:"
docker-compose ps