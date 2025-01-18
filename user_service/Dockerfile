FROM php:8.2-alpine

RUN apk add --no-cache postgresql-dev

RUN docker-php-ext-install pdo pdo_pgsql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

COPY composer.* ./

RUN composer install --no-autoloader

EXPOSE 8000

ENTRYPOINT [ "sh", "/app/entrypoint.sh" ]
