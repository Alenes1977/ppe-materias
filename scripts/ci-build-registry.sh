#!/usr/bin/env sh
# Construye linux/amd64 con Kaniko y publica en el Container Registry de GitLab.
# Sin Docker-in-Docker: el runner UNAV no permite DinD privilegiado.
set -eu

require() {
  eval "val=\${$1:-}"
  if [ -z "$val" ]; then
    echo "Falta la variable CI: $1" >&2
    exit 1
  fi
}

require CI_REGISTRY
require CI_REGISTRY_IMAGE
require CI_REGISTRY_USER
require CI_REGISTRY_PASSWORD
require CI_PROJECT_DIR
require CI_COMMIT_SHORT_SHA

IMAGE_TAG="${IMAGE_TAG:-$CI_COMMIT_SHORT_SHA}"
IMAGE="${CI_REGISTRY_IMAGE}:${IMAGE_TAG}"
IMAGE_LATEST="${CI_REGISTRY_IMAGE}:latest"

mkdir -p /kaniko/.docker
AUTH="$(printf '%s:%s' "${CI_REGISTRY_USER}" "${CI_REGISTRY_PASSWORD}" | base64 | tr -d '\n')"
printf '%s\n' "{\"auths\":{\"${CI_REGISTRY}\":{\"auth\":\"${AUTH}\"}}}" > /kaniko/.docker/config.json

echo "Construyendo linux/amd64 y subiendo ${IMAGE} (+ :latest)…"

/kaniko/executor \
  --custom-platform=linux/amd64 \
  --context "${CI_PROJECT_DIR}" \
  --dockerfile "${CI_PROJECT_DIR}/Dockerfile" \
  --destination "${IMAGE}" \
  --destination "${IMAGE_LATEST}" \
  --cache=false

echo "Imagen publicada: ${IMAGE}"
echo "También etiquetada: ${IMAGE_LATEST}"
