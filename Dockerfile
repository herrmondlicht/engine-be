FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build

RUN npm run migration

EXPOSE 4040

CMD [ "node", "build/index.js" ]