const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Путь к файлу с данными
const DATA_FILE = path.join(__dirname, 'data.json');

// Инициализация файла данных
function initDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  }
}

// Чтение данных
function readData() {
  initDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

// Запись данных
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Генерация ID (как в mockapi.io — строковые ID)
function generateId(items) {
  if (items.length === 0) return '1';
  const maxId = Math.max(...items.map(item => parseInt(item.id) || 0));
  return String(maxId + 1);
}

// Применение фильтров (как в mockapi.io)
function applyFilters(items, query) {
  let result = [...items];

  // Фильтрация по полям (field=value)
  Object.keys(query).forEach(key => {
    if (['page', 'limit', 'sortBy', 'order', 'search'].includes(key)) return;
    
    result = result.filter(item => {
      const value = item[key];
      const queryValue = query[key];
      
      if (value === undefined) return true;
      
      // Поддержка массивов значений (field=value1&field=value2)
      if (Array.isArray(queryValue)) {
        return queryValue.some(qv => String(value).toLowerCase().includes(String(qv).toLowerCase()));
      }
      
      return String(value).toLowerCase().includes(String(queryValue).toLowerCase());
    });
  });

  // Глобальный поиск (search=term)
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    result = result.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm)
      )
    );
  }

  return result;
}

// Применение сортировки
function applySorting(items, sortBy, order = 'asc') {
  if (!sortBy) return items;

  return [...items].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Попытка преобразовать в числа
    if (!isNaN(aVal) && !isNaN(bVal)) {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// Применение пагинации
function applyPagination(items, page, limit) {
  if (!page && !limit) return items;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const startIndex = (pageNum - 1) * limitNum;

  return items.slice(startIndex, startIndex + limitNum);
}

// ============ CRUD ENDPOINTS ============

// GET /:resource - Получить все записи
app.get('/:resource', (req, res) => {
  const { resource } = req.params;
  const data = readData();

  if (!data[resource]) {
    data[resource] = [];
    writeData(data);
  }

  let items = data[resource];

  // Применяем фильтры
  items = applyFilters(items, req.query);

  // Применяем сортировку
  items = applySorting(items, req.query.sortBy, req.query.order);

  // Применяем пагинацию
  items = applyPagination(items, req.query.page, req.query.limit);

  res.json(items);
});

// GET /:resource/:id - Получить одну запись
app.get('/:resource/:id', (req, res) => {
  const { resource, id } = req.params;
  const data = readData();

  if (!data[resource]) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
  }

  const item = data[resource].find(item => item.id === id);

  if (!item) {
    return res.status(404).json({ error: `Item with id '${id}' not found` });
  }

  res.json(item);
});

// POST /:resource - Создать запись
app.post('/:resource', (req, res) => {
  const { resource } = req.params;
  const data = readData();

  if (!data[resource]) {
    data[resource] = [];
  }

  const newItem = {
    ...req.body,
    id: generateId(data[resource]),
    createdAt: new Date().toISOString()
  };

  data[resource].push(newItem);
  writeData(data);

  res.status(201).json(newItem);
});

// PUT /:resource/:id - Полное обновление записи
app.put('/:resource/:id', (req, res) => {
  const { resource, id } = req.params;
  const data = readData();

  if (!data[resource]) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
  }

  const index = data[resource].findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Item with id '${id}' not found` });
  }

  const updatedItem = {
    ...req.body,
    id: id, // ID нельзя изменить
    updatedAt: new Date().toISOString()
  };

  data[resource][index] = updatedItem;
  writeData(data);

  res.json(updatedItem);
});

// PATCH /:resource/:id - Частичное обновление записи
app.patch('/:resource/:id', (req, res) => {
  const { resource, id } = req.params;
  const data = readData();

  if (!data[resource]) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
  }

  const index = data[resource].findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Item with id '${id}' not found` });
  }

  const updatedItem = {
    ...data[resource][index],
    ...req.body,
    id: id, // ID нельзя изменить
    updatedAt: new Date().toISOString()
  };

  data[resource][index] = updatedItem;
  writeData(data);

  res.json(updatedItem);
});

// DELETE /:resource/:id - Удалить запись
app.delete('/:resource/:id', (req, res) => {
  const { resource, id } = req.params;
  const data = readData();

  if (!data[resource]) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
  }

  const index = data[resource].findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Item with id '${id}' not found` });
  }

  const deletedItem = data[resource].splice(index, 1)[0];
  writeData(data);

  res.json(deletedItem);
});

// ============ ВЛОЖЕННЫЕ РЕСУРСЫ ============

// GET /:resource/:id/:nestedResource - Вложенные ресурсы
app.get('/:resource/:id/:nestedResource', (req, res) => {
  const { resource, id, nestedResource } = req.params;
  const data = readData();

  // Проверяем существование родительского ресурса
  if (!data[resource]) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
  }

  const parentItem = data[resource].find(item => item.id === id);
  if (!parentItem) {
    return res.status(404).json({ error: `Item with id '${id}' not found in '${resource}'` });
  }

  // Ищем вложенные ресурсы
  if (!data[nestedResource]) {
    data[nestedResource] = [];
    writeData(data);
  }

  // Фильтруем по parentId или {resource}Id
  const foreignKey = `${resource.replace(/s$/, '')}Id`;
  let items = data[nestedResource].filter(item => 
    item[foreignKey] === id || item.parentId === id
  );

  // Применяем фильтры, сортировку, пагинацию
  items = applyFilters(items, req.query);
  items = applySorting(items, req.query.sortBy, req.query.order);
  items = applyPagination(items, req.query.page, req.query.limit);

  res.json(items);
});

// POST /:resource/:id/:nestedResource - Создать вложенный ресурс
app.post('/:resource/:id/:nestedResource', (req, res) => {
  const { resource, id, nestedResource } = req.params;
  const data = readData();

  // Проверяем существование родительского ресурса
  if (!data[resource]) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
  }

  const parentItem = data[resource].find(item => item.id === id);
  if (!parentItem) {
    return res.status(404).json({ error: `Item with id '${id}' not found in '${resource}'` });
  }

  if (!data[nestedResource]) {
    data[nestedResource] = [];
  }

  const foreignKey = `${resource.replace(/s$/, '')}Id`;
  const newItem = {
    ...req.body,
    id: generateId(data[nestedResource]),
    [foreignKey]: id,
    createdAt: new Date().toISOString()
  };

  data[nestedResource].push(newItem);
  writeData(data);

  res.status(201).json(newItem);
});

// Корневой endpoint
app.get('/', (req, res) => {
  const data = readData();
  const resources = Object.keys(data);
  
  res.json({
    message: 'Mock API Server (mockapi.io compatible)',
    resources: resources,
    endpoints: resources.map(r => `/${r}`)
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('Endpoints:');
  console.log('  GET    /:resource          - Get all items');
  console.log('  GET    /:resource/:id      - Get single item');
  console.log('  POST   /:resource          - Create item');
  console.log('  PUT    /:resource/:id      - Replace item');
  console.log('  PATCH  /:resource/:id      - Update item');
  console.log('  DELETE /:resource/:id      - Delete item');
  console.log('');
  console.log('Query parameters:');
  console.log('  ?page=1&limit=10           - Pagination');
  console.log('  ?sortBy=field&order=asc    - Sorting');
  console.log('  ?search=term               - Global search');
  console.log('  ?field=value               - Filter by field');
});