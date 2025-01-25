#!/bin/sh

composer install

php artisan key:generate
php artisan migrate
php artisan config:clear

supervisord -c /app/docker/supervisord.conf
