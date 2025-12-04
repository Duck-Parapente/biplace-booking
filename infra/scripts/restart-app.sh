#!/bin/bash
set -e

# ----------- PATH SETUP -----------
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$INFRA_DIR/.env"
COMPOSE_FILE="$INFRA_DIR/docker-compose.yml"

# ----------- LOAD .env CONFIG -----------
if [ ! -f "$ENV_FILE" ]; then
    echo "Missing .env file at: $ENV_FILE"
    exit 1
fi

export $(grep -v '^#' "$ENV_FILE" | xargs)

if [ -z "$ENV" ]; then
    echo "Missing required variable ENV in .env"
    exit 1
fi

START_TIME=$(date +%s)

#------------------------------- Logging ----------------------------------#

log_info() { echo "$1" >&2; }
log_success() { echo "✅ $1" >&2; }
log_error() { echo "❌ $1" >&2; exit 1; }
log_warning() { echo "⚠️  $1" >&2; }

usage() {
    cat <<EOF
Usage: ./restart-app.sh

Reads environment from infra/.env file (ENV variable).

Supported environments:
    staging  Build and start full staging stack
    prod     Build and start production stack

Environment structure:
    infra/
      Caddyfile
      docker-compose.yml
      .env (contains ENV=staging or ENV=prod)
EOF
}

finish() {
    local exit_code=$?
    local end_time=$(date +%s)
    local duration=$(( end_time - START_TIME ))
    if [[ $exit_code -eq 0 ]]; then
        log_success "Completed in ${duration}s"
    else
        log_error "Failed after ${duration}s (exit code $exit_code)"
    fi
}
trap finish EXIT

#--------------------------- Pre-flight checks ----------------------------#

ensure_requirements() {
    command -v docker >/dev/null || log_error "docker CLI not found. Install Docker Desktop or CLI."
    docker compose version >/dev/null 2>&1 || log_error "'docker compose' plugin not available. Update Docker."
    command -v pnpm >/dev/null || log_warning "pnpm not found; backend build may fail."
    [[ -f "$COMPOSE_FILE" ]] || log_error "docker-compose.yml not found at $COMPOSE_FILE"
}

validate_environment() {
    [[ "$ENV" =~ ^(staging|prod)$ ]] || log_error "Invalid environment in .env: $ENV (must be 'staging' or 'prod')"
}

toggle_maintenance_mode() {
    local state="$1"  # "true" or "false"
    local action="$2" # "Enabling" or "Disabling"
    
    log_info "🔧 ${action} maintenance mode..."
    
    local sql="UPDATE \"FeatureFlag\" SET \"isActive\" = ${state}, \"updatedAt\" = NOW() WHERE \"key\" = 'maintenance_mode';"
    local postgres_container="bb-${ENV}-postgres"
    
    if docker exec "$postgres_container" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "$sql" >/dev/null 2>&1; then
        log_success "Maintenance mode ${action,,}d"
    else
        log_warning "Could not ${action,,} maintenance mode (database may not be ready)"
    fi
}

handle_running_containers() {
    cd "$INFRA_DIR" || log_error "Failed to navigate to infra directory: $INFRA_DIR"
    local running
    running=$(docker compose ps -q || true)
    [[ -n "$running" ]] || return 0

    log_warning "Found running containers:"
    docker compose ps --format 'table {{.Name}}\t{{.State}}\t{{.Ports}}'
    echo ""

    # Enable maintenance mode before stopping containers
    toggle_maintenance_mode "true" "Enabling"

    log_info "🛑 Stopping existing containers..."
    docker compose down && log_success "Containers stopped"
}

# Load pre-built image from /srv to minimize downtime
load_prebuilt_image() {
    local archive="/srv/${ENV}-biplace.tar.gz"
    log_info "📦 Attempting to load pre-built image: ${archive}"
    if [[ -f "${archive}" ]]; then
        if gunzip -c "${archive}" | docker load >/dev/null 2>&1; then
            log_success "Pre-built image loaded from ${archive}"
        else
            log_warning "Failed to load image from ${archive}; continuing with existing images."
        fi
    else
        log_warning "Archive not found (${archive}); skipping image preload."
    fi
}

deploy_containers() {
    cd "$INFRA_DIR" || log_error "Failed to navigate to infra directory: $INFRA_DIR"
    DOCKER_BUILDKIT=0 docker compose --profile "$ENV" up -d --build || log_error "Failed to deploy $ENV environment"
    log_success "$ENV deployed!"
}

deploy_full_stack() {
    log_info "🏭 Deploying to $ENV environment..."
    deploy_containers
}

# Ensure main Caddy entrypoint is running
ensure_caddy_entrypoint_running() {
    if [[ -z "$(docker ps --filter name=caddy-entrypoint --filter status=running -q)" ]]; then
        log_warning "Main caddy-entrypoint container is NOT running."
        log_info "Starting caddy-entrypoint..."
        if command -v pnpm >/dev/null; then
            pnpm dc:caddy:up || log_error "Failed to start caddy-entrypoint"
            log_success "caddy-entrypoint started."
        else
            log_warning "pnpm not found, skipping caddy-entrypoint start"
        fi
    else
        log_success "caddy-entrypoint is running."
    fi
}

#----------------------------- Main execution -----------------------------#

echo "----- RESTART STARTED -----"
echo "Environment:   $ENV"
echo "Infra Dir:     $INFRA_DIR"
echo "Compose File:  $COMPOSE_FILE"
echo "----------------------------------------"

ensure_requirements
validate_environment
load_prebuilt_image
handle_running_containers
deploy_full_stack
ensure_caddy_entrypoint_running

# Disable maintenance mode after successful deployment
toggle_maintenance_mode "false" "Disabling"

echo "----------------------------------------"
echo "----- RESTART FINISHED -----"
