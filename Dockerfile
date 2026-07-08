FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p dist && cp index.html dist/
EXPOSE 3000
CMD ["npm", "start"]
