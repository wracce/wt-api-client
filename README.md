# WT API Wrapper

Библиотека для удобной работы с API выборок легаси платформы.

## Установка

```bash
npm install wt-api-wrapper
```

## Быстрый старт

### Простое использование

```typescript
import { getCollectionByCode, getCollectionById } from 'wt-api-wrapper';

// Получение данных по коду выборки
const response = await getCollectionByCode('user_list');
console.log(response.results);

// Получение данных по ID выборки
const response2 = await getCollectionById(123);
console.log(response2.results);
```

### Использование с настройками

```typescript
import { WTApiClient } from 'wt-api-wrapper';

const client = new WTApiClient({
  baseUrl: 'https://your-domain.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer your-token'
  }
});

const response = await client.getByCode('user_list');
```

## API

### WTApiClient

Основной класс для работы с API.

#### Конструктор

```typescript
const client = new WTApiClient(options?: WTApiClientOptions);
```

**Опции:**
- `baseUrl` - базовый URL (по умолчанию пустая строка)
- `timeout` - таймаут запросов в мс (по умолчанию 30000)
- `headers` - дополнительные заголовки

#### Методы

##### fetchCollection(params)

Выполняет запрос к API выборки с полным набором параметров.

```typescript
const response = await client.fetchCollection({
  collection_code: 'user_list',
  limit: 50,
  start: 0,
  parameters: 'department=IT;active=1',
  user_id: 123,
  sort: [{ property: 'name', direction: 'ascending' }]
});
```

##### getByCode(code, options?)

Получение данных по коду выборки.

```typescript
const response = await client.getByCode('user_list', {
  limit: 100,
  parameters: 'active=1'
});
```

##### getById(id, options?)

Получение данных по ID выборки.

```typescript
const response = await client.getById(123, {
  limit: 50
});
```

##### getPaginated(params, page, pageSize)

Получение пагинированных данных.

```typescript
const response = await client.getPaginated(
  { collection_code: 'user_list' },
  2, // страница
  25 // размер страницы
);
```

##### getSorted(params, sortBy, direction)

Получение отсортированных данных.

```typescript
const response = await client.getSorted(
  { collection_code: 'user_list' },
  'name',
  'descending'
);
```



## Типы

### CollectionRequestParams

```typescript
interface CollectionRequestParams {
  collection_code?: string;
  collection_id?: string | number;
  limit?: number;
  start?: number;
  parameters?: string;
  user_id?: string | number;
  sort?: SortParameter[];
}
```

### CollectionResponse

```typescript
interface CollectionResponse<T = any> {
  success: boolean;
  messageText: string;
  results: T[];
  columns?: any[];
  total?: number;
  sorters?: SortParameter[];
}
```

### SortParameter

```typescript
interface SortParameter {
  property: string;
  direction: 'ascending' | 'descending';
}
```

## Примеры использования

### Получение списка пользователей с пагинацией

```typescript
import { WTApiClient } from 'wt-api-wrapper';

const client = new WTApiClient({
  baseUrl: 'https://your-domain.com'
});

async function getUsers(page = 1, pageSize = 50) {
  try {
    const response = await client.getPaginated(
      { collection_code: 'users_list' },
      page,
      pageSize
    );
    
    return {
      data: response.results,
      total: response.total,
      hasNext: (page * pageSize) < (response.total || 0)
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
```

### Получение данных с фильтрацией

```typescript
import { WTApiUtils, getCollectionByCode } from 'wt-api-wrapper';

async function getActiveUsers(department: string) {
  const parameters = WTApiUtils.createParametersString({
    department,
    active: 1
  });
  
  const response = await getCollectionByCode('users_list', {
    parameters,
    sort: [{ property: 'last_name', direction: 'ascending' }]
  });
  
  return response.results;
}
```

### Обработка ошибок

```typescript
import { WTApiClient, WTApiError } from 'wt-api-wrapper';

const client = new WTApiClient();

try {
  const response = await client.getByCode('non_existent_collection');
} catch (error) {
  if (error instanceof WTApiError) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    if (error.status) {
      console.error('HTTP Status:', error.status);
    }
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Создание типизированного клиента

```typescript
// Определяем типы для ваших данных
interface User {
  id: number;
  name: string;
  email: string;
  department: string;
}

interface Department {
  id: number;
  name: string;
  head_id: number;
}

// Используем типизированные запросы
const users = await client.getByCode<User>('users_list');
const departments = await client.getByCode<Department>('departments_list');

// TypeScript будет знать типы данных
users.results.forEach(user => {
  console.log(user.name); // TypeScript знает, что это string
});
```

## Лицензия

MIT
