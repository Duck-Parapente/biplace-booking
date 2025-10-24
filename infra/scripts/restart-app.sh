#!/bin/bash

# Restart script for Biplace Booking
# Usage:
#   ./restart-app.sh <environment> [--force]
# Environments: staging | prod
# Examples:
#   ./restart-app.sh staging --force
#   ./restart-app.sh prod
#   ./restart-app.sh status   # Show container status
#   ./restart-app.sh help     # Show help

set -euo pipefail
IFS=$'\n\t'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$INFRA_DIR/docker-compose.yml"

ACTION=${1:-local}
FORCE_FLAG=${2:-}

START_TIME=$(date +%s)

#------------------------------- Logging ----------------------------------#

log_info() { echo "$1" >&2; }
log_success() { echo "✅ $1" >&2; }
log_error() { echo "❌ $1" >&2; exit 1; }
log_warning() { echo "⚠️  $1" >&2; }

usage() {
    cat <<EOF
Usage: ./restart-app.sh <environment|status|help> [--force]

Environments:
    staging  Build and start full staging stack
    prod     Build and start production stack (asks for confirmation)

Commands:
    status   Show docker compose service status
    help     Show this help message

Options:
    --force  Stop running containers without confirmation

Environment structure:
    infra/
      Caddyfile
      docker-compose.yml
      .env.prod
      .env.staging
      .env (local defaults)
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

get_env_icon() {
    case $1 in
        staging) echo "🧪" ;;
        prod) echo "🏭" ;;
        *) echo "❓" ;;
    esac
}

get_api_url() {
    case $1 in
        staging) echo "https://bb-backend-staging.duckparapente.fr" ;;
        prod) echo "https://bb-backend-prod.duckparapente.fr" ;;
        *) echo "" ;;
    esac
}

validate_environment() {
    local env=$1
    [[ "$env" =~ ^(staging|prod)$ ]] || log_error "Invalid environment: $env"
}

copy_env_files() {
    local env=$1

    log_info "📂 Copying environment files for '$env'"
    cp "$INFRA_DIR/.env.$env" "$INFRA_DIR/.env" || log_error "Failed to copy .env"
    log_success "Environment files for '$env' copied."
}

handle_running_containers() {
    cd "$INFRA_DIR" || log_error "Failed to navigate to infra directory: $INFRA_DIR"
    local running
    running=$(docker compose ps -q || true)
    [[ -n "$running" ]] || return 0

    log_warning "Found running containers:"
    docker compose ps --format 'table {{.Name}}\t{{.State}}\t{{.Ports}}'
    echo ""

    if [[ "$FORCE_FLAG" == "--force" ]]; then
        log_info "🛑 Force flag detected, stopping containers..."
        docker compose down && log_success "Containers stopped"
    else
        read -r -p "🛑 Stop existing containers? (y/N) " answer
        if [[ "$answer" =~ ^[yY]$ ]]; then
            log_info "🛑 Stopping existing containers..."
            docker compose down && log_success "Containers stopped"
        else
            log_error "Deployment cancelled. Use --force to override or manually run: docker compose down"
        fi
    fi
}

# New: load pre-built image from /srv to minimize downtime
load_prebuilt_image() {
    local env="$1"
    local archive="/srv/biplace-backend-${env}.tar.gz"
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
    local profile=$1
    local success_message=$2
    local api_url=$3
    cd "$INFRA_DIR" || log_error "Failed to navigate to infra directory: $INFRA_DIR"
    DOCKER_BUILDKIT=0 docker compose --profile "$profile" up -d --build || log_error "Failed to deploy $profile environment"
    log_success "$success_message"
    [[ -n "$api_url" ]] && log_info "🌐 API available at: $api_url"
}

confirm_production() {
    local env=$1
    [[ "$env" != "prod" ]] && return 0
    log_warning "⚠️  About to DEPLOY to PRODUCTION. Continue? (y/N)"
    read -r confirm
    [[ "$confirm" =~ ^[yY]$ ]] || log_error "Production deployment cancelled."
}

deploy_full_stack() {
    local env=$1
    local api_url
    api_url=$(get_api_url "$env")
    local icon
    icon=$(get_env_icon "$env")
    log_info "$icon Deploying to $env environment..."
    confirm_production "$env"
    copy_env_files "$env"
    deploy_containers "$env" "$env deployed!" "$api_url"
}

# New: ensure main Caddy entrypoint is running
ensure_caddy_entrypoint_running() {
    if [[ -z "$(docker ps --filter name=caddy-entrypoint --filter status=running -q)" ]]; then
        log_warning "Main caddy-entrypoint container is NOT running."
        echo "Start it with: pnpm dc:main-caddy up -d" >&2
    else
        log_success "caddy-entrypoint is running."
    fi
}

#----------------------------- Main execution -----------------------------#

main() {
    case "$ACTION" in
        help|-h|--help)
            usage; return 0 ;;
        staging|prod)
            local env="$ACTION"
            ensure_requirements
            validate_environment "$env"
            load_prebuilt_image "$env"
            handle_running_containers
            deploy_full_stack "$env"
            # New post-deploy check
            ensure_caddy_entrypoint_running
            ;;
        *)
            log_error "Unknown action: $ACTION (use ./restart-app.sh help)" ;;
    esac
}

main "$@"
