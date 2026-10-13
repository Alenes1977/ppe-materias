# syntax=docker/dockerfile:1
# Imagen de producción para ECS Fargate (linux/amd64): SPA + Express (SAML2).
# Puerto interno: 8181 (la task ya define PORT=8181). Health: GET /health (sin auth).

# --- Build: frontend Vite ---
FROM --platform=linux/amd64 node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Runtime: Express (SAML + SPA) ---
FROM --platform=linux/amd64 node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=8181

RUN addgroup -S app && adduser -S app -G app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY --from=build /app/dist ./dist

USER app
EXPOSE 8181

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8181)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["./node_modules/.bin/tsx", "server/index.ts"]
