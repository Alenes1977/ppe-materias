#!/usr/bin/env sh
# Comprueba que la imagen publicada existe y es linux/amd64 (lo que pide Fargate).
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
require CI_COMMIT_SHORT_SHA

IMAGE="${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHORT_SHA}"

crane auth login -u "${CI_REGISTRY_USER}" -p "${CI_REGISTRY_PASSWORD}" "${CI_REGISTRY}"

echo "Manifiesto de ${IMAGE}:"
crane manifest "${IMAGE}"

CONFIG="$(crane config "${IMAGE}")"
echo "${CONFIG}"

echo "${CONFIG}" | grep -Eq '"architecture":[[:space:]]*"amd64"'
echo "${CONFIG}" | grep -Eq '"os":[[:space:]]*"linux"'

echo "Imagen ${IMAGE} es linux/amd64."
