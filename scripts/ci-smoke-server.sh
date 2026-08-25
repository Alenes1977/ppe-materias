#!/usr/bin/env sh
# Arranca el preview de producción (dist/) y exige GET /health.
# Corre sobre el árbol del repo + dist/ (tras npm run build), no sobre Docker:
# el runner UNAV no puede ejecutar la imagen. Si el bundle no sirve, ECS también fallará.
#
# En ECS el contenedor escucha el puerto 80 (nginx). Aquí usamos 8080 porque el
# job CI no es root y no puede bind a 80. El path de health es el mismo: /health.
set -eu

export PORT="${PORT:-8080}"

if [ ! -d dist ]; then
  echo "Falta dist/: hay que ejecutar npm run build antes." >&2
  exit 1
fi

npx vite preview --host 127.0.0.1 --port "${PORT}" &
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
