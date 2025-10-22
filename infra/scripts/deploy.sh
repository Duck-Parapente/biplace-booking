#!/bin/bash

# Deployment script for Biplace Booking
# Usage:
#   ./deploy.sh <environment> [--force]
# Environments: local | staging | prod
# Examples:
#   ./deploy.sh local
#   ./deploy.sh staging --force
#   ./deploy.sh prod
#   ./deploy.sh status   # Show container status
#   ./deploy.sh help     # Show help

set -euo pipefail
IFS=$'\n\t'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$INFRA_DIR/docker-compose.yml"

ACTION=${1:-local}
FORCE_FLAG=${2:-}

START_TIME=$(date +%s)

#------------------------------- Logging ----------------------------------#

# Functions
log_info() { echo "$1" >&2; }
log_success() { echo "✅ $1" >&2; }
log_error() { echo "❌ $1" >&2; exit 1; }
log_warning() { echo "⚠️  $1" >&2; }

usage() {
    cat <<EOF
Usage: ./deploy.sh <environment|status|help> [--force]

Environments:
    local    Start only PostgreSQL via Docker (run backend with pnpm locally)
    staging  Build backend and start staging stack
    prod     Build backend and start production stack (asks confirmation)

Commands:
    status   Show docker compose service status
    help     Show this help message

Options:
    --force  Stop running containers without interactive prompt

Environment files expected at: infra/env/<env>/.env
Compose file: $COMPOSE_FILE
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
        local) echo "🔧" ;;
        staging) echo "🧪" ;;
        prod) echo "🏭" ;;
        *) echo "❓" ;;
    esac
}

get_api_url() {
    case $1 in
        staging) echo "https://api-staging.duckparapente.fr" ;;
        prod) echo "https://api.duckparapente.fr" ;;
        *) echo "" ;;
    esac
}

validate_environment() {
    local env=$1
    [[ "$env" =~ ^(local|staging|prod)$ ]] || log_error "Invalid environment: $env"
}

check_env_file() {
    local env=$1
    local env_file="$INFRA_DIR/env/$env/.env"
    [[ -f "$env_file" ]] || log_error "Environment file $env_file not found!"
    # shellcheck source=/dev/null
    set -a && source "$env_file" && set +a
    export ENV="$env"
    log_info "📋 Environment: $env"
    log_info "📄 Using config: $env_file"
}

handle_running_containers() {
    cd "$INFRA_DIR" || log_error "Failed to navigate to infra directory: $INFRA_DIR"
    local running
    running=$(docker compose ps -q || true)
    [[ -n "$running" ]] || return 0

    log_warning "Found running containers:";
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

build_backend() {
    log_info "📦 Building backend with turbo..."
    local project_root="$(dirname "$INFRA_DIR")"
    cd "$project_root" || log_error "Cannot cd to project root: $project_root"
    if command -v pnpm >/dev/null; then
        pnpm build --filter=backend || log_error "Backend build failed"
    else
        log_error "pnpm not installed; cannot build backend"
    fi
    log_success "Backend build successful"
}

deploy_containers() {
    local profile=$1
    local success_message=$2
    local api_url=$3
    cd "$INFRA_DIR" || log_error "Failed to navigate to infra directory: $INFRA_DIR"
    docker compose --profile "$profile" up -d --build || log_error "Failed to deploy $profile environment"
    log_success "$success_message"
    [[ -n "$api_url" ]] && log_info "🌐 API available at: $api_url"
}

confirm_production() {
    local env=$1
    [[ "$env" != "prod" ]] && return 0
    log_warning "About to deploy to PRODUCTION. Continue? (y/N)"
    read -r confirm
    [[ "$confirm" =~ ^[yY]$ ]] || log_error "Production deployment cancelled"
}

deploy_local() {
    log_info "🔧 Starting local development environment (database only)";
    cd "$INFRA_DIR" || log_error "Failed to navigate to infra directory: $INFRA_DIR"
    [[ -f "$COMPOSE_FILE" ]] || log_error "docker-compose.yml not found at $COMPOSE_FILE"
    log_info "🐳 Starting PostgreSQL container..."
    docker compose --profile local up -d postgres || log_error "Failed to start PostgreSQL"
    log_success "PostgreSQL running (port 5432). Start backend separately: pnpm dev:backend"
}

deploy_full_stack() {
    local env=$1
    local api_url
    api_url=$(get_api_url "$env")
    local icon
    icon=$(get_env_icon "$env")
    log_info "$icon Deploying to $env environment..."
    confirm_production "$env"
    build_backend
    deploy_containers "$env" "${env^} deployed!" "$api_url"
}

show_status() {
    cd "$INFRA_DIR" || log_error "Failed to navigate to infra directory: $INFRA_DIR"
    log_info "📊 Container status:";
    docker compose ps || log_error "Failed to list containers"
}

# Main execution
main() {
    case "$ACTION" in
        help|-h|--help)
            usage; return 0 ;;
        status)
            ensure_requirements; show_status; return 0 ;;
        local|staging|prod)
            local env="$ACTION"
            ensure_requirements
            validate_environment "$env"
            check_env_file "$env"
            handle_running_containers
            if [[ "$env" == "local" ]]; then
                deploy_local
            else
                deploy_full_stack "$env"
            fi
            show_status
            ;;
        *)
            log_error "Unknown action: $ACTION (use ./deploy.sh help)" ;;
    esac
}

# Run main function
main "$@"