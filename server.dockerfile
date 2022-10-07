FROM node:18

WORKDIR /server/app

COPY server/package*.json ./

COPY server/tsconfig*.json ./

RUN npm install

COPY ./server .

RUN npm run build

CMD [ "node", "dist/main.js" ]
