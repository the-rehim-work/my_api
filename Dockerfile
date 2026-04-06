FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node prisma/seed.js && node scripts/importData.js && node server.js"]