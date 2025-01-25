FROM php:8.2-alpine

RUN apk add --no-cache postgresql-dev supervisor

RUN docker-php-ext-install pdo pdo_pgsql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

ENTRYPOINT [ "sh", "/app/docker/entrypoint.sh" ]
