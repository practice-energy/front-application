# Front Application - Cloudflare Pages

Это Next.js приложение, оптимизированное для деплоя на Cloudflare Pages.

## Установка

```bash
pnpm install
```

## Разработка

```bash
pnpm dev
```

## Сборка для Cloudflare Pages

```bash
# Обычная сборка
pnpm build

# Сборка для Cloudflare Pages
pnpm build:cloudflare
```

## Деплой

### Preview Environment
```bash
pnpm deploy:preview
```

### Staging Environment
```bash
pnpm deploy:staging
```

### Production Environment
```bash
pnpm deploy:production
```

## Конфигурация

### Файлы конфигурации:

- `wrangler.toml` - основная конфигурация Cloudflare Workers
- `_headers` - HTTP заголовки для Cloudflare Pages
- `_redirects` - правила перенаправления
- `_worker.js` - точка входа для Cloudflare Pages
- `_routes.json` - настройка маршрутов
- `open-next.config.ts` - конфигурация OpenNext

### Переменные окружения:

Убедитесь, что в Cloudflare Pages настроены следующие переменные окружения:

- `NODE_ENV`
- `NEXTJS_SERVER_URL`
- `CUSTOM_KEY`
- `NEXT_PUBLIC_GRAPHQL_HTTP_URL`
- `NEXT_PUBLIC_GRAPHQL_WS_URL`

## Мониторинг

Для просмотра логов:

```bash
# Все окружения
pnpm tail

# Preview
pnpm tail:preview

# Staging
pnpm tail:staging

# Production
pnpm tail:production
```

## Структура проекта

```
├── app/                    # Next.js App Router
├── components/             # React компоненты
├── public/                 # Статические файлы
├── services/               # API и GraphQL сервисы
├── types/                  # TypeScript типы
├── wrangler.toml          # Cloudflare Workers конфигурация
├── _headers               # HTTP заголовки
├── _redirects             # Правила перенаправления
├── _worker.js             # Точка входа для Cloudflare Pages
└── open-next.config.ts    # OpenNext конфигурация
```
