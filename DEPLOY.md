# Deploy

## 1. Подготовка

```bash
git pull
cp .env.production.example .env.production
```

Заполни значения в `.env.production`.

## 2. Запуск

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Frontend в production берётся из уже собранной папки `frontend/dist`, поэтому после изменений UI перед коммитом нужно обновлять билд локально:

```bash
cd frontend
npm install
npm run build
```

## 3. Проверка

Frontend:

```text
http://SERVER_IP
```

Backend REST:

```text
http://SERVER_IP:3000
```

GraphQL:

```text
http://SERVER_IP:3000/graphql
```

## 4. Полезные команды

Логи:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

Перезапуск после обновления:

```bash
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Остановка:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```
