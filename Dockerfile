# Étape de build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Étape de prod (serveur statique)
FROM nginx:alpine
COPY --from=builder /app/dist/olive_front/browser /usr/share/nginx/html
