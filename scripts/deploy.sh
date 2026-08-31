#!/usr/bin/env bash
set -euo pipefail

APP_ENV="${APP_ENV:-staging}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
GHCR_OWNER="${GHCR_OWNER,,}"
GITHUB_ACTOR="${GITHUB_ACTOR:-github-actions[bot]}"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

BACKEND_IMAGE="ghcr.io/${GHCR_OWNER}/scholarpro-backend:${IMAGE_TAG}"
FRONTEND_IMAGE="ghcr.io/${GHCR_OWNER}/scholarpro-frontend:${IMAGE_TAG}"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "GITHUB_TOKEN is required for GHCR pull authentication."
  exit 1
fi

docker login ghcr.io -u "$GITHUB_ACTOR" -p "$GITHUB_TOKEN"

docker pull "$BACKEND_IMAGE"
docker pull "$FRONTEND_IMAGE"

docker network inspect scholarpro >/dev/null 2>&1 || docker network create scholarpro

docker rm -f scholarpro-backend scholarpro-frontend >/dev/null 2>&1 || true

docker run -d \
  --name scholarpro-backend \
  --network scholarpro \
  -p 3000:3000 \
  -e NODE_ENV="$APP_ENV" \
  "$BACKEND_IMAGE"

docker run -d \
  --name scholarpro-frontend \
  --network scholarpro \
  -p 3001:3000 \
  -e NODE_ENV="$APP_ENV" \
  "$FRONTEND_IMAGE"

printf '\nDeployment completed successfully.\n'
printf 'Backend: http://localhost:3000\n'
printf 'Frontend: http://localhost:3001\n'
