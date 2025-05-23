# Étape de build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Étape de production
FROM nginx:alpine
COPY --from=builder /app/dist/olive_front /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
