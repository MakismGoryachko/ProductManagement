FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --legacy-peer-deps
RUN apk add --no-cache openssl

RUN npx prisma generate --no-engine

COPY . .

CMD ["npm", "run", "start:dev"]