# pull official base image
FROM node:16.12.0-alpine

# set working directory
WORKDIR /client/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY client/package.json ./
COPY client/package-lock.json ./
COPY client/.env.production ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY ./client ./

# # start app
# CMD ["npm", "start"]
# start app
RUN npm run build
RUN npm i -g serve
CMD ["serve", "-s", "build"]
