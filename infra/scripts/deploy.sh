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
  (clean) remove old archives in .tmp/
  1. docker buildx build (loads image locally)
  2. docker save | gzip -> .tmp/biplace-backend-<env>.tar.gz
  3. scp archive to remote host (unless SKIP_SCP set)
  4. remote restart: /srv/biplace-booking-<env>/infra/scripts/restart-app.sh <env>
EOF
  exit 1
}

ENVIRONMENT="${1:-}"
[[ -z "${ENVIRONMENT}" ]] && usage
if [[ "${ENVIRONMENT}" != "staging" && "${ENVIRONMENT}" != "prod" ]]; then
  echo "Error: environment must be 'staging' or 'prod'" >&2
  usage
fi

REMOTE_HOST="${REMOTE_HOST:-duck-tower}"
REMOTE_PATH="${REMOTE_PATH:-/srv}"
PLATFORM="${BUILD_PLATFORM:-linux/amd64}"

# Added temp directory handling
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
TMP_DIR="${ROOT_DIR}/.tmp"
mkdir -p "${TMP_DIR}"

IMAGE_TAG="biplace-backend:${ENVIRONMENT}"
ARCHIVE="${TMP_DIR}/biplace-backend-${ENVIRONMENT}.tar.gz"

# Updated clean step to target .tmp directory
echo "[clean] Removing previous local archives (${TMP_DIR}/biplace-backend-*.tar.gz)..."
rm -f "${TMP_DIR}"/biplace-backend-*.tar.gz || true

echo "[1/4] Building image ${IMAGE_TAG} for ${PLATFORM}..."
docker buildx ls >/dev/null 2>&1 || {
  echo "docker buildx not available. Install/enable buildx." >&2
  exit 2
}

docker buildx build \
  --platform "${PLATFORM}" \
  -t "${IMAGE_TAG}" \
  -f apps/backend/Dockerfile \
  --load .

echo "[2/4] Saving and compressing image -> ${ARCHIVE} ..."
docker save "${IMAGE_TAG}" | gzip > "${ARCHIVE}"

if [[ -n "${SKIP_SCP:-}" ]]; then
  echo "[3/4] SKIP_SCP set; skipping transfer."
  echo "Archive ready: ${ARCHIVE}"
  echo "[4/4] Skipping remote restart (scp skipped)."
  exit 0
fi

echo "[3/4] Transferring ${ARCHIVE} to ${REMOTE_HOST}:${REMOTE_PATH}/"
scp "${ARCHIVE}" "${REMOTE_HOST}:${REMOTE_PATH}/"

REMOTE_RESTART_CMD="/srv/biplace-booking-${ENVIRONMENT}/infra/scripts/restart-app.sh ${ENVIRONMENT}"
echo "[4/4] Executing remote restart: ${REMOTE_RESTART_CMD}"
if ssh "${REMOTE_HOST}" "${REMOTE_RESTART_CMD}"; then
  echo "Remote restart completed."
else
  echo "Remote restart command failed or script missing: ${REMOTE_RESTART_CMD}" >&2
fi

echo "Done."
echo "Remote file: ${REMOTE_PATH}/${ARCHIVE}"
echo "To load remotely (manual step):"
echo "  ssh ${REMOTE_HOST} 'gunzip -c ${REMOTE_PATH}/$(basename "${ARCHIVE}") | docker load'"
