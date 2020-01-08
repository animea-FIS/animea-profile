FROM node:12

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE $ANIMES_PORT

CMD npm start