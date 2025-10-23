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
  4. remote git sync: git fetch origin && git reset --hard origin/<env>
  5. remote restart: /srv/biplace-booking-<env>/infra/scripts/restart-app.sh <env>
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
REMOTE_APP_DIR="/srv/biplace-booking-${ENVIRONMENT}"

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

echo "[2/5] Saving and compressing image -> ${ARCHIVE} ..."
docker save "${IMAGE_TAG}" | gzip > "${ARCHIVE}"

if [[ -n "${SKIP_SCP:-}" ]]; then
  echo "[3/5] SKIP_SCP set; skipping transfer."
  echo "Archive ready: ${ARCHIVE}"
  echo "[4/5] Skipping remote git sync (scp skipped)."
  echo "[5/5] Skipping remote restart (scp skipped)."
  exit 0
fi

echo "[3/5] Transferring ${ARCHIVE} to ${REMOTE_HOST}:${REMOTE_PATH}/"
scp "${ARCHIVE}" "${REMOTE_HOST}:${REMOTE_PATH}/" || {
  echo "scp failed" >&2
  exit 1
}

# New: remote git fetch/reset on environment branch
echo "[4/5] Remote git sync in ${REMOTE_APP_DIR} (branch: ${ENVIRONMENT})..."
if ssh "${REMOTE_HOST}" "cd '${REMOTE_APP_DIR}' && git fetch origin && git checkout ${ENVIRONMENT} && git reset --hard origin/${ENVIRONMENT}"; then
  echo "Remote git sync completed."
else
  echo "Remote git sync failed (directory or branch may be invalid)." >&2
fi

REMOTE_RESTART_CMD="${REMOTE_APP_DIR}/infra/scripts/restart-app.sh ${ENVIRONMENT}"
echo "[5/5] Executing remote restart: ${REMOTE_RESTART_CMD}"
if ssh "${REMOTE_HOST}" "${REMOTE_RESTART_CMD}"; then
  echo "Remote restart completed."
else
  echo "Remote restart command failed or script missing: ${REMOTE_RESTART_CMD}" >&2
fi

echo "Done."
