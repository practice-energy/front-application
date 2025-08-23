# GraphQL Services

Этот модуль содержит все GraphQL запросы, мутации и сгенерированные типы для работы с бэкендом.

## Структура

```
src/services/
├── queries/           # GraphQL запросы
│   ├── auth.ts       # Запросы аутентификации
│   ├── specialist.ts # Запросы специалистов
│   ├── service.ts    # Запросы услуг
│   └── dashboard.ts  # Запросы дашборда
├── mutations/        # GraphQL мутации
│   ├── auth.ts       # Мутации аутентификации
│   ├── user.ts       # Мутации пользователей
│   ├── specialist.ts # Мутации специалистов
│   ├── service.ts    # Мутации услуг
│   ├── calendar.ts   # Мутации календаря
│   ├── booking.ts    # Мутации бронирований
│   └── chat.ts       # Мутации чатов
├── generated/        # Сгенерированные типы и хуки
├── examples.tsx      # Примеры использования
├── index.ts          # Экспорт всех запросов и мутаций
└── schema.graphqls   # GraphQL схема
```

## Установка и настройка

1. Установите зависимости:
```bash
pnpm add -D @graphql-codegen/cli @graphql-codegen/client-preset
```

2. Сгенерируйте типы:
```bash
pnpm graphql-codegen
```

## Использование

### Импорт запросов и мутаций

```typescript
import { 
  useGetMe, 
  useGetSpecialist, 
  useLikeSpecialist,
  useUpdateUser 
} from '@/services'
```

### Примеры использования

#### Получение данных пользователя

```typescript
import { useGetMe } from '@/services'

const UserProfile = () => {
  const { data: user, loading, error } = useGetMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

#### Получение данных специалиста

```typescript
import { useGetSpecialist } from '@/services'

const SpecialistProfile = ({ id }: { id: string }) => {
  const { data: specialist, loading, error } = useGetSpecialist({ id })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>{specialist.name}</h1>
      <p>{specialist.title}</p>
    </div>
  )
}
```

#### Мутации

```typescript
import { useLikeSpecialist, useUpdateUser } from '@/services'

const LikeButton = ({ specialistId }: { specialistId: string }) => {
  const [likeSpecialist] = useLikeSpecialist()

  const handleLike = () => {
    likeSpecialist({ variables: { id: specialistId } })
  }

  return <button onClick={handleLike}>Like</button>
}
```

## Доступные запросы

### Аутентификация
- `useGetMe()` - Получить данные текущего пользователя
- `useGetUser({ id })` - Получить данные пользователя по ID

### Специалисты
- `useGetSpecialist({ id })` - Получить данные специалиста
- `useGetLikedSpecialists()` - Получить список избранных специалистов

### Услуги
- `useGetService({ id })` - Получить данные услуги

### Календарь и дашборд
- `useGetCalendar({ hat })` - Получить данные календаря
- `useGetDashboard()` - Получить данные дашборда

## Доступные мутации

### Аутентификация
- `useRequestLogin({ input })` - Запрос входа
- `useVerifyLogin({ input })` - Подтверждение входа
- `useRefreshToken({ input })` - Обновление токена
- `useLogout()` - Выход

### Пользователи
- `useUpdateUser({ input })` - Обновление пользователя
- `usePushPersonalityTest({ input })` - Отправка теста личности

### Специалисты
- `useUpscaleToSpecialist({ input })` - Стать специалистом
- `useUpdateSpecialist({ input })` - Обновление специалиста
- `useLikeSpecialist({ id })` - Лайк специалиста
- `useDislikeSpecialist({ id })` - Дизлайк специалиста

### Услуги
- `useCreateService({ input })` - Создание услуги
- `useUpdateService({ input })` - Обновление услуги

### Календарь
- `useCreateCalendar({ input })` - Создание календаря
- `useUpdateCalendar({ input })` - Обновление календаря

### Бронирования
- `useBookSlot({ input })` - Бронирование слота
- `useRebookSlot({ input })` - Перебронирование слота
- `useBurnBooking({ id })` - Отмена бронирования
- `useApproveBooking({ id, hat })` - Подтверждение бронирования
- `useCompleteBooking({ id, hat })` - Завершение бронирования

### Чаты
- `useAddChat({ input })` - Добавление чата
- `usePushMessage({ input })` - Отправка сообщения
- `useAckMessages({ hat })` - Подтверждение сообщений

## Типы данных

Все типы данных автоматически генерируются из GraphQL схемы и доступны для импорта:

```typescript
import type { 
  User, 
  SpecialistProfile, 
  Service, 
  Booking,
  Chat 
} from '@/services'
```

## Обновление схемы

При изменении GraphQL схемы:

1. Обновите файл `src/services/schema.graphqls`
2. Запустите генерацию типов: `pnpm graphql-codegen`
3. Обновите запросы и мутации при необходимости

## Конфигурация

Конфигурация GraphQL Code Generator находится в файле `codegen.ts` в корне проекта.

## Примеры

Полные примеры использования находятся в файле `src/services/examples.tsx`.
