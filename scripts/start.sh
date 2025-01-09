#!/usr/bin/env bash
npm install

npm uninstall bcrypt

npm install bcrypt

npm run db:migrate

npm run db:seed

npm run dev