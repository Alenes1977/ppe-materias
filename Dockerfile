# Etapa de construcción
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine
# Copiar los archivos construidos
COPY --from=build /app/build /usr/share/nginx/html
# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exponer puerto 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 