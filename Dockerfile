FROM node:12-alpine

RUN apk add --no-cache \
  udev \
  ttf-freefont \
  chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build

EXPOSE 4040

CMD [ "npm", "start" ]