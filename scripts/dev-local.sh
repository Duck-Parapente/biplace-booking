#!/bin/bash

# Local development setup with pnpm and turbo
# This script is called by `pnpm dev:local`

echo "🚀 Starting Biplace Booking local development..."

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Start database
echo "🐳 Starting PostgreSQL database..."
cd infra
./deploy.sh local

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Go back to root and start backend
cd ..
echo "🏗️  Starting backend with turbo..."
pnpm dev:backend