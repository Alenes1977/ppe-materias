#!/usr/bin/env sh
# Arranca el servidor como en ECS (NODE_ENV=production) y exige GET /health.
# Corre sobre el árbol del repo + dist/ (tras npm run build), no sobre Docker:
# el runner UNAV no puede ejecutar la imagen. Si el proceso no arranca, ECS
# también fallará (cert SAML, SESSION_SECRET, etc.).
#
# En ECS el contenedor escucha PORT=8181. Aquí usamos 8080 porque no hace falta
# coincidir con el ALB: el path de health sí, /health.
set -eu

export NODE_ENV=production
export PORT="${PORT:-8080}"
export APP_BASE_URL="${APP_BASE_URL:-https://guiadocente.unav.edu}"
export SESSION_SECRET="${SESSION_SECRET:-ci-smoke-session-secret-at-least-32ch}"
export CAS_BASE_URL="${CAS_BASE_URL:-https://cas.unav.es/cas}"

if [ ! -d dist ]; then
  echo "Falta dist/: hay que ejecutar npm run build antes." >&2
  exit 1
fi

npx tsx server/index.ts &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT

node <<'JS'
const port = process.env.PORT || '8080';
const url = `http://127.0.0.1:${port}/health`;
const deadline = Date.now() + 25000;

const tick = async () => {
  try {
    const res = await fetch(url);
    const body = await res.text();
    if (res.ok && body.trim() === 'ok') {
      console.log('health OK', res.status, body.trim());
      process.exit(0);
    }
    console.log('health aún no OK', res.status, body);
  } catch (err) {
    console.log('esperando servidor…', err instanceof Error ? err.message : err);
  }
  if (Date.now() > deadline) {
    console.error('Timeout: /health no respondió. ECS marcaría la task unhealthy.');
    process.exit(1);
  }
  setTimeout(tick, 400);
};

tick();
JS
