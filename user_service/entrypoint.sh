#!/bin/sh

php artisan generate:key

php artisan migrate

php artisan serve --host=0.0.0.0 --port=8000
