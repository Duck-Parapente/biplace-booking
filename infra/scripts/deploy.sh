#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/deploy-image.sh <staging|prod>

Automatically cleans previous local biplace-backend-*.tar.gz archives (stored in .tmp/) before building.

Environment variables:
  REMOTE_HOST   SSH host (default: duck-tower)
  REMOTE_PATH   Remote directory (default: /srv)
  SKIP_SCP      If set (non-empty), skip scp step
  BUILD_PLATFORM Override platform (default: linux/amd64)

Steps:
  0. verify clean working tree then checkout environment branch, fetch, hard reset
  (clean) remove old archives in .tmp/
  1. docker buildx build (loads image locally)
  2. docker save | gzip -> .tmp/biplace-backend-<env>.tar.gz
  3. scp archive to remote host (unless SKIP_SCP set)
  4. remote git sync: git fetch origin && git reset --hard origin/<env>
  5. remote restart: /srv/biplace-booking-<env>/infra/scripts/restart-app.sh <env>
EOF
  exit 1
}

parse_args() {
  ENVIRONMENT="${1:-}"
  [[ -z "${ENVIRONMENT}" ]] && usage
  if [[ "${ENVIRONMENT}" != "staging" && "${ENVIRONMENT}" != "prod" ]]; then
    echo "Error: environment must be 'staging' or 'prod'" >&2
    usage
  fi
}

setup_paths() {
  REMOTE_HOST="${REMOTE_HOST:-duck-tower-2}"
  REMOTE_PATH="${REMOTE_PATH:-/srv}"
  PLATFORM="${BUILD_PLATFORM:-linux/amd64}"
  REMOTE_APP_DIR="/srv/biplace-booking-${ENVIRONMENT}"
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
  TMP_DIR="${ROOT_DIR}/.tmp"
  mkdir -p "${TMP_DIR}"
  IMAGE_TAG="biplace-backend:${ENVIRONMENT}"
  ARCHIVE="${TMP_DIR}/biplace-backend-${ENVIRONMENT}.tar.gz"
}

checkout_branch() {
  echo "[branch] Checking working tree cleanliness..."
  if [[ -n "$(git -C "${ROOT_DIR}" status --porcelain)" ]]; then
    echo "Error: working tree has uncommitted changes. Commit, stash, or clean before deploying." >&2
    exit 1
  fi

  echo "[branch] Switching to branch '${ENVIRONMENT}'..."
  if ! git -C "${ROOT_DIR}" rev-parse --verify "${ENVIRONMENT}" >/dev/null 2>&1; then
    echo "Error: branch '${ENVIRONMENT}' does not exist locally." >&2
    exit 1
  fi
  git -C "${ROOT_DIR}" checkout "${ENVIRONMENT}"

  echo "[branch] Fetching latest from origin..."
  git -C "${ROOT_DIR}" fetch origin || { echo "Error: git fetch failed" >&2; exit 1; }

  echo "[branch] Hard resetting to origin/${ENVIRONMENT}..."
  git -C "${ROOT_DIR}" reset --hard "origin/${ENVIRONMENT}" || { echo "Error: git reset failed" >&2; exit 1; }

  echo "[branch] Ready on commit $(git -C "${ROOT_DIR}" rev-parse --short HEAD)"
}

clean_archives() {
  echo "[clean] Removing previous local archives (${TMP_DIR}/biplace-backend-*.tar.gz)..."
  rm -f "${TMP_DIR}"/biplace-backend-*.tar.gz || true
}

build_image() {
  echo "[1/5] Building image ${IMAGE_TAG} for ${PLATFORM}..."
  docker buildx ls >/dev/null 2>&1 || {
    echo "docker buildx not available. Install/enable buildx." >&2
    exit 2
  }
  docker buildx build \
    --platform "${PLATFORM}" \
    -t "${IMAGE_TAG}" \
    -f apps/backend/Dockerfile \
    --load .
}

save_archive() {
  echo "[2/5] Saving and compressing image -> ${ARCHIVE} ..."
  docker save "${IMAGE_TAG}" | gzip > "${ARCHIVE}"
}

maybe_skip_scp() {
  if [[ -n "${SKIP_SCP:-}" ]]; then
    echo "[3/5] SKIP_SCP set; skipping transfer."
    echo "Archive ready: ${ARCHIVE}"
    echo "[4/5] Skipping remote git sync (scp skipped)."
    echo "[5/5] Skipping remote restart (scp skipped)."
    exit 0
  fi
}

transfer_archive() {
  echo "[3/5] Transferring ${ARCHIVE} to ${REMOTE_HOST}:${REMOTE_PATH}/"
  scp "${ARCHIVE}" "${REMOTE_HOST}:${REMOTE_PATH}/" || {
    echo "scp failed" >&2
    exit 1
  }
}

transfer_env_file() {
  local ENV_FILE="${ROOT_DIR}/infra/.env.${ENVIRONMENT}"
  echo "[3.5/5] Uploading environment file to ${REMOTE_HOST}:${REMOTE_APP_DIR}/infra/.env"

  if [[ ! -f "${ENV_FILE}" ]]; then
    echo "Warning: ${ENV_FILE} not found, skipping env file upload." >&2
    return 0
  fi

  scp "${ENV_FILE}" "${REMOTE_HOST}:${REMOTE_APP_DIR}/infra/.env" || {
    echo "env file upload failed" >&2
    exit 1
  }
}

remote_git_sync() {
  echo "[4/5] Remote git sync in ${REMOTE_APP_DIR} (branch: ${ENVIRONMENT})..."
  if ssh "${REMOTE_HOST}" "cd '${REMOTE_APP_DIR}' && git fetch origin && git checkout ${ENVIRONMENT} && git reset --hard origin/${ENVIRONMENT}"; then
    echo "Remote git sync completed."
  else
    echo "Remote git sync failed (directory or branch may be invalid)." >&2
  fi
}

remote_restart() {
  local cmd="${REMOTE_APP_DIR}/infra/scripts/restart-app.sh ${ENVIRONMENT}"
  echo "[5/5] Executing remote restart: ${cmd}"
  if ssh "${REMOTE_HOST}" "${cmd}"; then
    echo "Remote restart completed."
    echo "[info] Prisma migrations will run inside the container (CMD runs 'prisma migrate deploy')."
  else
    echo "Remote restart command failed or script missing: ${cmd}" >&2
  fi
}

run() {
  parse_args "$@"
  setup_paths
  checkout_branch
  clean_archives
  build_image
  save_archive
  maybe_skip_scp
  transfer_archive
  transfer_env_file
  remote_git_sync
  remote_restart
  echo "Done."
}

run "$@"
