#!/bin/sh

npm i

npx prisma generate

npx prisma db push

npm run dev