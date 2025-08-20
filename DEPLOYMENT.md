# Деплой на Cloudflare Pages

Этот документ описывает процесс настройки и деплоя проекта на Cloudflare Pages.

## 🚀 Быстрый старт

### 1. Подготовка Cloudflare

1. Создайте аккаунт на [Cloudflare](https://cloudflare.com)
2. Перейдите в раздел **Pages**
3. Создайте новый проект

### 2. Настройка GitHub Secrets

Добавьте следующие секреты в настройках вашего GitHub репозитория:

#### Обязательные секреты:
- `CLOUDFLARE_API_TOKEN` - API токен Cloudflare
- `CLOUDFLARE_ACCOUNT_ID` - ID вашего аккаунта Cloudflare
- `CLOUDFLARE_PROJECT_NAME` - название проекта в Cloudflare Pages

#### Опциональные секреты (для production):
- `NEXT_PUBLIC_GRAPHQL_HTTP_URL` - URL GraphQL HTTP endpoint
- `NEXT_PUBLIC_GRAPHQL_WS_URL` - URL GraphQL WebSocket endpoint
- `NEXT_PUBLIC_APP_URL` - URL вашего приложения

### 3. Получение Cloudflare API Token

1. Перейдите в [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Выберите **My Profile** → **API Tokens**
3. Создайте новый токен с правами:
   - **Zone:Zone:Read** (для всех зон)
   - **Zone:DNS:Edit** (для всех зон)
   - **Account:Cloudflare Pages:Edit** (для всех аккаунтов)

### 4. Получение Account ID

1. В Cloudflare Dashboard перейдите в **Workers & Pages**
2. Account ID отображается в правом верхнем углу

## 📋 Настройка окружений

### Production
- Автоматический деплой при push в `main` или `master`
- Использует production переменные окружения

### Preview
- Автоматический деплой при создании Pull Request
- Использует preview переменные окружения
- Доступен по уникальному URL

### Staging (опционально)
- Ручной деплой или по push в `develop`
- Использует staging переменные окружения

## 🔧 Конфигурация

### Обновление wrangler.toml

Замените следующие значения в `wrangler.toml`:

\`\`\`toml
[env.production]
route = "your-actual-domain.com/*"
zone_id = "your-actual-zone-id"

[env.staging]
route = "staging.your-actual-domain.com/*"
zone_id = "your-actual-zone-id"
\`\`\`

### Переменные окружения

Добавьте необходимые переменные окружения в Cloudflare Pages Dashboard:

#### Production:
\`\`\`
NODE_ENV=production
NEXT_PUBLIC_GRAPHQL_HTTP_URL=https://your-api.com/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=wss://your-api.com/graphql
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

#### Preview:
\`\`\`
NODE_ENV=preview
NEXT_PUBLIC_GRAPHQL_HTTP_URL=https://staging-api.com/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=wss://staging-api.com/graphql
NEXT_PUBLIC_APP_URL=https://preview.your-domain.com
\`\`\`

## 🚀 Процесс деплоя

### Автоматический деплой

1. **Push в main/master** → Деплой в production
2. **Pull Request** → Деплой preview версии
3. **Merge PR** → Деплой в production

### Ручной деплой

\`\`\`bash
# Установка Wrangler CLI
npm install -g wrangler

# Логин в Cloudflare
wrangler login

# Деплой в production
wrangler pages deploy .next --project-name=your-project-name

# Деплой в preview
wrangler pages deploy .next --project-name=your-project-name --branch=preview
\`\`\`

## 📊 Мониторинг

### Логи деплоя
- Доступны в Cloudflare Pages Dashboard
- GitHub Actions logs в репозитории

### Статус деплоя
- ✅ Успешный деплой
- ❌ Ошибка сборки
- ⚠️ Предупреждения

## 🔍 Troubleshooting

### Частые проблемы

#### 1. Ошибка сборки
\`\`\`bash
# Проверьте локальную сборку
pnpm run build

# Проверьте зависимости
pnpm install --frozen-lockfile
\`\`\`

#### 2. Ошибка API Token
- Убедитесь, что токен имеет правильные права
- Проверьте, что токен не истек

#### 3. Ошибка переменных окружения
- Проверьте, что все переменные добавлены в GitHub Secrets
- Убедитесь, что переменные доступны в Cloudflare Pages

#### 4. Ошибка домена
- Проверьте, что домен добавлен в Cloudflare
- Убедитесь, что DNS записи настроены правильно

### Полезные команды

\`\`\`bash
# Проверка конфигурации
wrangler whoami

# Список проектов
wrangler pages project list

# Информация о проекте
wrangler pages project view your-project-name

# Логи деплоя
wrangler pages deployment tail your-project-name
\`\`\`

## 📈 Оптимизация

### Кэширование
- Cloudflare автоматически кэширует статические файлы
- Настройте кэширование для API запросов

### CDN
- Cloudflare Pages использует глобальную CDN
- Файлы автоматически распределяются по всему миру

### Безопасность
- HTTPS включен по умолчанию
- DDoS защита включена
- WAF доступен в Pro планах

## 🔗 Полезные ссылки

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
