FROM node:20-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
