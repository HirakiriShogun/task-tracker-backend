FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
COPY deploy/backend/entrypoint.sh /usr/local/bin/task-tracker-backend-entrypoint.sh

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_tracker?schema=public
ENV CHECKPOINT_DISABLE=1
ENV CI=1

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates postgresql-client \
  && rm -rf /var/lib/apt/lists/*
RUN chmod +x /usr/local/bin/task-tracker-backend-entrypoint.sh

RUN npm ci --ignore-scripts
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["/usr/local/bin/task-tracker-backend-entrypoint.sh"]
