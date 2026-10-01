# Mock API Server

Express сервер, совместимый с [mockapi.io](https://mockapi.io). Поддерживает CRUD операции, пагинацию, сортировку, фильтрацию и вложенные ресурсы.

## Установка

```bash
npm install
```

## Запуск

```bash
# Production
npm start

# Development (с auto-reload)
npm run dev
```

Сервер запустится на `http://localhost:3000`

## API Endpoints

### Основные операции

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/:resource` | Получить все записи |
| GET | `/:resource/:id` | Получить одну запись |
| POST | `/:resource` | Создать запись |
| PUT | `/:resource/:id` | Полностью заменить запись |
| PATCH | `/:resource/:id` | Частично обновить запись |
| DELETE | `/:resource/:id` | Удалить запись |

### Вложенные ресурсы

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/:resource/:id/:nested` | Получить вложенные записи |
| POST | `/:resource/:id/:nested` | Создать вложенную запись |

## Query Parameters

### Пагинация

```
GET /users?page=1&limit=10
```

### Сортировка

```
GET /users?sortBy=name&order=asc
GET /users?sortBy=createdAt&order=desc
```

### Фильтрация

```
GET /users?name=John
GET /posts?userId=1
```

### Глобальный поиск

```
GET /users?search=john
```

### Комбинирование

```
GET /posts?userId=1&sortBy=createdAt&order=desc&page=1&limit=5
```

## Примеры использования

### Создание пользователя

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alex", "email": "alex@example.com"}'
```

### Получение всех пользователей

```bash
curl http://localhost:3000/users
```

### Получение постов пользователя (вложенный ресурс)

```bash
curl http://localhost:3000/users/1/posts
```

### Обновление пользователя

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'
```

### Удаление пользователя

```bash
curl -X DELETE http://localhost:3000/users/1
```

## Структура данных

Данные хранятся в файле `data.json`. Вы можете редактировать его напрямую или через API.

```json
{
  "users": [...],
  "posts": [...],
  "comments": [...]
}
```

## Автоматические поля

При создании записи автоматически добавляются:
- `id` — уникальный строковый идентификатор
- `createdAt` — дата создания в ISO формате

При обновлении записи добавляется:
- `updatedAt` — дата обновления

## Вложенные ресурсы

Для связи используется foreign key в формате `{resource}Id`:
- `posts` связаны с `users` через `userId`
- `comments` связаны с `posts` через `postId`

## Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `PORT` | `3000` | Порт сервера |

## License

MIT