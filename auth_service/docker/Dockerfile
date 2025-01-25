FROM node:22-alpine3.20

RUN apk add --no-cache openssl curl

WORKDIR /app

ENTRYPOINT [ "sh", "/app/docker/entrypoint.sh" ]
