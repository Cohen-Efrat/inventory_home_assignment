FROM node:14.14.0-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --production --silent


# Bundle app source
COPY . .
CMD [ "node", "./src/index.js" ]
