FROM node:12

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --production


#this arg is required so we can pass the DBURL below
ARG DATABASE_URL=127.0.0.1

#set db which migration will be ran on build
ENV DATABASE_URL=$DATABASE_URL

COPY --chown=node:node . .

RUN npm run build

EXPOSE 4040

CMD [ "npm", "start" ]