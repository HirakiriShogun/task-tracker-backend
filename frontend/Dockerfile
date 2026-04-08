FROM node:24-bookworm-slim

WORKDIR /app

COPY dist ./dist
COPY server.js ./server.js

EXPOSE 80

CMD ["node", "server.js"]
