FROM node:22-alpine3.20

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json .

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "sh", "/app/entrypoint.sh" ]
