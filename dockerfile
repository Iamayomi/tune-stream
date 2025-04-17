FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN yarn build

EXPOSE 8080

CMD ["node", "dist/main"]