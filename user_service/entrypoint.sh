#!/bin/sh

php artisan key:generate

php artisan migrate

supervisord -c /app/supervisord.conf
