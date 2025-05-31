FROM node:20-slim

RUN apt-get update && \
  apt-get install -y \
  chromium \
  wget \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxrandr2 \
  libxshmfence1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app



WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install --production

COPY --chown=node:node . .
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
RUN npm run build

EXPOSE 4040

CMD [ "npm", "start" ]