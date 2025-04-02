# 🔐 Authentication System with Caching and Sessions

## 📌 Описание

Веб-приложение с системой аутентификации, персонализацией интерфейса и кэшированием данных. Основные возможности:

- ✅ Регистрация и авторизация пользователей
- 🎨 Персонализация (3 темы оформления)
- ⚡ Кэширование данных API
- 🔒 Защита от основных уязвимостей

## 🛠 Технологии

| Компонент       | Технологии                     |
|-----------------|--------------------------------|
| **Backend**     | Node.js, Express               |
| **Frontend**    | HTML5, CSS3, Vanilla JS        |
| **Безопасность**| bcrypt, express-session        |
| **Кэширование** | Файловый кэш (1 минута)        |

## 🚀 Быстрый старт

### Предварительные требования
Убедитесь, что у вас установлены:
- Node.js (v14+)
- npm (v6+)

### Установка
```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/auth-system.git
cd auth-system

# 2. Установите зависимости
npm install

# 3. Запустите сервер
node server.js
```

После запуска откройте в браузере:  
http://localhost:3000

## 🌟 Основные функции

### 🔐 Аутентификация
Регистрация нового пользователя:
```javascript
// Пример запроса на регистрацию
POST /register
{
  "username": "testuser",
  "password": "securepassword123"
}
```

Вход в систему:
```javascript
// Пример запроса на вход
POST /login
{
  "username": "testuser",
  "password": "securepassword123"
}
```

### 🎨 Персонализация интерфейса
Выбор темы сохраняется в `localStorage`:
```javascript
// Код переключения темы
themeSelector.addEventListener('change', function() {
  const theme = this.value;
  document.body.className = theme;
  localStorage.setItem('theme', theme);
});
```

Доступные темы:
1. Light (по умолчанию)
2. Dark
3. Blue

### ⚡ Кэширование данных
Серверный код кэширования:
```javascript
// Проверка актуальности кэша
if (fs.existsSync(CACHE_FILE)) {
  const stats = fs.statSync(CACHE_FILE);
  const cacheAge = Date.now() - stats.mtimeMs;
  
  if (cacheAge < CACHE_DURATION) {
    return res.json({ ...cachedData, cached: true });
  }
}
```

## 📂 Структура проекта
```
auth-system/
├── server.js          # Основной сервер
├── package.json
├── public/            # Фронтенд
│   ├── index.html     # Страница входа
│   ├── profile.html   # Профиль
│   ├── styles.css     # Стили
│   └── script.js      # Клиентский JS
└── cache/             # Файлы кэша
```

## 🔧 API Endpoints

| Метод | Путь       | Описание                          | Доступ    |
|-------|------------|-----------------------------------|-----------|
| POST  | /register  | Регистрация                       | Публичный |
| POST  | /login     | Вход в систему                    | Публичный |
| GET   | /profile   | Страница профиля                  | Приватный |
| POST  | /logout    | Выход из системы                  | Приватный |
| GET   | /data      | Получение данных с кэшированием   | Приватный |

