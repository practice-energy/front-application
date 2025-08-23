# GraphQL Setup Guide

## Что было сделано

1. **Установлены зависимости:**
   - `@graphql-codegen/cli` - CLI для генерации кода
   - `@graphql-codegen/client-preset` - Пресет для Apollo Client

2. **Создана конфигурация:**
   - `codegen.ts` - конфигурационный файл для GraphQL Code Generator
   - Настроена генерация TypeScript типов и React хуков

3. **Созданы GraphQL запросы и мутации:**
   - `src/services/queries/` - папка с запросами
   - `src/services/mutations/` - папка с мутациями
   - Все запросы соответствуют обновленной схеме

4. **Сгенерированы типы и хуки:**
   - `src/generated/` - папка с сгенерированными файлами
   - Автоматически созданы TypeScript типы для всех GraphQL операций
   - Созданы React хуки для использования в компонентах

5. **Добавлены скрипты:**
   - `pnpm codegen` - генерация типов
   - `pnpm codegen:watch` - генерация в режиме наблюдения

## Структура файлов

```
src/services/
├── queries/           # GraphQL запросы
│   ├── auth.ts       # Аутентификация
│   ├── specialist.ts # Специалисты
│   ├── service.ts    # Услуги
│   └── dashboard.ts  # Дашборд
├── mutations/        # GraphQL мутации
│   ├── auth.ts       # Аутентификация
│   ├── user.ts       # Пользователи
│   ├── specialist.ts # Специалисты
│   ├── service.ts    # Услуги
│   ├── calendar.ts   # Календарь
│   ├── booking.ts    # Бронирования
│   └── chat.ts       # Чаты
├── generated/        # Сгенерированные файлы
│   ├── gql.ts        # GraphQL операции
│   ├── graphql.ts    # Типы и хуки
│   └── index.ts      # Экспорты
├── examples.tsx      # Примеры использования
├── index.ts          # Главный экспорт
├── README.md         # Документация
└── schema.graphqls   # GraphQL схема
```

## Использование

### 1. Импорт хуков

```typescript
import { 
  useGetMe, 
  useGetSpecialist, 
  useLikeSpecialist,
  useUpdateUser 
} from '@/services'
```

### 2. Примеры использования

#### Получение данных пользователя
```typescript
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

#### Мутации
```typescript
const LikeButton = ({ specialistId }: { specialistId: string }) => {
  const [likeSpecialist] = useLikeSpecialist()

  const handleLike = () => {
    likeSpecialist({ variables: { id: specialistId } })
  }

  return <button onClick={handleLike}>Like</button>
}
```

## Доступные операции

### Запросы (Queries)
- `useGetMe()` - данные текущего пользователя
- `useGetUser({ id })` - данные пользователя по ID
- `useGetSpecialist({ id })` - данные специалиста
- `useGetLikedSpecialists()` - избранные специалисты
- `useGetService({ id })` - данные услуги
- `useGetCalendar({ hat })` - данные календаря
- `useGetDashboard()` - данные дашборда

### Мутации (Mutations)
- `useRequestLogin({ input })` - запрос входа
- `useVerifyLogin({ input })` - подтверждение входа
- `useUpdateUser({ input })` - обновление пользователя
- `useLikeSpecialist({ id })` - лайк специалиста
- `useBookSlot({ input })` - бронирование слота
- `useAddChat({ input })` - добавление чата
- И многие другие...

## Обновление схемы

При изменении GraphQL схемы:

1. Обновите `src/services/schema.graphqls`
2. Запустите: `pnpm codegen`
3. При необходимости обновите запросы/мутации

## Команды

```bash
# Генерация типов
pnpm codegen

# Генерация в режиме наблюдения
pnpm codegen:watch

# Проверка типов
pnpm type-check
```

## Типы данных

Все типы автоматически генерируются и доступны для импорта:

```typescript
import type { 
  User, 
  SpecialistProfile, 
  Service, 
  Booking,
  Chat 
} from '@/services'
```

## Преимущества

1. **Типобезопасность** - все GraphQL операции типизированы
2. **Автодополнение** - IDE подсказывает доступные поля
3. **Валидация** - ошибки обнаруживаются на этапе компиляции
4. **Производительность** - оптимизированные запросы
5. **Удобство** - готовые React хуки для использования

## Следующие шаги

1. Настройте Apollo Client в приложении
2. Добавьте обработку ошибок
3. Настройте кэширование
4. Добавьте оптимистичные обновления
5. Настройте подписки для real-time данных
