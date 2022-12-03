FROM node:12

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

#se the database that migration will be ran

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --production

ENV DATABASE_URL ${DATABASE_URL}

COPY --chown=node:node . .

RUN npm run build

EXPOSE 4040

CMD [ "npm", "start" ]