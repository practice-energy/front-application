# Practice Energy - Frontend Application

Frontend приложение для поиска и бронирования специалистов, построенное на Next.js 15 с деплоем на Cloudflare Workers через Vercel CLI.

## 🚀 Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Отдельный сервис (проксируется через Cloudflare Worker)
- **Styling**: Tailwind CSS, Radix UI
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 📁 Структура проекта

```
front-application/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Дашборд
│   ├── specialist/        # Страницы специалистов
│   ├── service/           # Страницы услуг
│   └── ...
├── components/            # React компоненты
├── lib/                   # Утилиты и API клиент
├── types/                 # TypeScript типы
├── middleware.ts          # Next.js middleware
├── _worker.js            # Cloudflare Worker для проксирования API
├── wrangler.toml         # Конфигурация Cloudflare Workers
└── vercel.json           # Конфигурация Vercel
```

## 🛠️ Установка и запуск

### Локальная разработка

1. Установите зависимости:
```bash
pnpm install
```

2. Запустите сервер разработки:
```bash
pnpm dev
```

3. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для продакшена

```bash
# Сборка с Vercel CLI
pnpm build

# Или обычная сборка Next.js
pnpm build:next
pnpm start
```

## 🚀 Деплой на Vercel

### Автоматический деплой

1. Подключите ваш GitHub репозиторий к Vercel
2. Vercel автоматически определит Next.js проект
3. Настройте переменные окружения в Vercel Dashboard

### Ручной деплой

1. Установите зависимости (Vercel CLI уже включен):
```bash
pnpm install
```

2. Войдите в аккаунт:
```bash
pnpm vercel login
```

3. Деплой:
```bash
# Preview деплой
pnpm vercel-deploy-preview

# Production деплой
pnpm vercel-deploy
```

### Переменные окружения

Создайте файл `.env.local` для локальной разработки:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

В Vercel Dashboard добавьте:

```env
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

## 🌐 Архитектура

### Frontend (Next.js)
- Статические страницы и компоненты
- Клиентская логика
- API клиент для взаимодействия с бэкендом

### Backend (Отдельный сервис)
- REST API для всех операций
- База данных
- Бизнес-логика

### Cloudflare Worker
- Проксирование API запросов к бэкенду
- Обслуживание статических файлов
- CORS и security headers

## 📡 API Endpoints

Все API запросы проксируются к внешнему бэкенду через Cloudflare Worker:

- `GET /api/specialists` - Специалисты
- `GET /api/services` - Услуги  
- `GET /api/bookings` - Бронирования
- `POST /api/bookings` - Создание бронирования
- И другие эндпоинты бэкенда

## 🔧 Конфигурация

### next.config.mjs
Настроен для работы с Vercel:
- Оптимизация изображений включена
- Поддержка серверных компонентов
- Настройки для production

### vercel.json
Конфигурация для Vercel:
- Настройки функций
- Security headers
- Rewrites для API

### middleware.ts
Обрабатывает:
- CORS
- Security headers
- Аутентификацию (базовая)

## 📦 Скрипты

```json
{
  "dev": "next dev",                    # Запуск разработки
  "build": "vercel build",              # Сборка с Vercel CLI
  "build:next": "next build",           # Обычная сборка Next.js
  "vercel-dev": "vercel dev",           # Разработка с Vercel CLI
  "vercel-deploy": "vercel --prod",     # Production деплой
  "vercel-deploy-preview": "vercel",    # Preview деплой
  "start": "next start",                # Запуск продакшен сервера
  "lint": "next lint",                  # Проверка кода
  "type-check": "tsc --noEmit"          # Проверка типов
}
```

## 🔒 Безопасность

- CORS настроен для всех доменов
- Security headers добавлены
- Базовая аутентификация для API endpoints
- Валидация входных данных

## 🧪 Тестирование API

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### Получить специалистов
```bash
curl https://your-app.vercel.app/api/specialists
```

### Создать бронирование
```bash
curl -X POST https://your-app.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user1",
    "specialistId": "1",
    "serviceId": "1",
    "date": "2024-01-15",
    "time": "14:00",
    "duration": 60,
    "price": 3000
  }'
```

## 📝 Дальнейшее развитие

1. **База данных**: Подключить PostgreSQL или MongoDB
2. **Аутентификация**: Добавить JWT или NextAuth.js
3. **Платежи**: Интеграция с платежными системами
4. **Уведомления**: Email/SMS уведомления
5. **Аналитика**: Добавить метрики и аналитику
6. **Тесты**: Написать unit и integration тесты

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License
