# syntax=docker/dockerfile:1
# Imagen de producción para ECS Fargate (linux/amd64): SPA Vite servida por nginx.
# Puerto interno: 80. Health: GET /health (sin autenticación).

# --- Build: frontend Vite ---
FROM --platform=linux/amd64 node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Runtime: nginx ---
FROM --platform=linux/amd64 nginx:1.30-alpine AS runtime

ENV PORT=80 \
    NGINX_ENVSUBST_FILTER=^PORT$

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/health || exit 1
