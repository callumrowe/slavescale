FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install || true
COPY . .
RUN mkdir -p dist && cp index.html dist/

FROM caddy:2.8-alpine
COPY --from=build /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
