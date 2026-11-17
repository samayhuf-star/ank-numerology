# Name Report backend — Node + headless Chrome (for HTML→PDF with Indic scripts).
FROM node:22-slim

# Chrome + the font families the report embeds (also installed system-wide as a fallback)
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates wget gnupg fonts-noto fonts-noto-core fonts-noto-cjk \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y --no-install-recommends google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_PATH=/usr/bin/google-chrome-stable
ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY lib ./lib
COPY engine ./engine
COPY api ./api
COPY server.js ./

EXPOSE 8080
CMD ["node", "server.js"]
