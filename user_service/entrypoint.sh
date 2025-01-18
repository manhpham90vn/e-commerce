#!/bin/sh

php artisan generate:key

php artisan migrate

supervisord -c /app/supervisord.conf
