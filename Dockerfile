FROM node:20-alpine

RUN apk add --no-cache postgresql-client bash

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

EXPOSE 5000

ENTRYPOINT [ "/app/scripts/start.sh" ]