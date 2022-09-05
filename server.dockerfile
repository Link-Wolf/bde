FROM node:18.8.0-alpine3.15 AS development

WORKDIR /server/app

COPY server/package*.json ./

COPY server/tsconfig*.json ./

RUN npm install glob rimraf

RUN npm install

COPY ./server .

RUN npm run build

FROM node:18.8.0-alpine3.15 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /server/app

COPY server/package*.json ./

COPY server/tsconfig*.json ./

RUN npm install

RUN npm run build

COPY ./server .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
