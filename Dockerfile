FROM node:16-slim

WORKDIR /app

ADD . /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]

