FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || true
COPY . .
RUN npm run build 2>/dev/null || mkdir -p dist && cp index.html dist/

FROM caddy:2.8-alpine
COPY --from=build /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
