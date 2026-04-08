FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts index.html ./
COPY src ./src

RUN npm ci --ignore-scripts
RUN chmod +x node_modules/esbuild/bin/esbuild node_modules/@esbuild/linux-x64/bin/esbuild
RUN node node_modules/esbuild/install.js
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
