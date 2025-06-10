FROM node:20


# Create app directory
WORKDIR /home/node/app

# Copy package files
COPY package*.json ./

# Set Puppeteer to use system Chromium and skip download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Install Chromium before npm install
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && \
  apt-get install -y google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*

# Install dependencies (Puppeteer will skip downloading Chromium)
RUN npm install --production

# Copy application code
COPY . .

# Set ownership of all files to node user
RUN chown -R node:node /home/node/app

# Switch to node user
USER node

# Build the application
RUN npm run build

EXPOSE 4040

CMD [ "npm", "start" ]