# ExpressJS CRUD API with TypeScript

A complete backend server built with ExpressJS and TypeScript that provides CRUD operations for user management with SQLite database.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete users
- **TypeScript**: Type-safe development
- **SQLite Database**: Lightweight, file-based database
- **Input Validation**: Comprehensive request validation
- **Filtering & Pagination**: Advanced query capabilities
- **Error Handling**: Proper error responses
- **Security**: Helmet for security headers
- **Logging**: Morgan for request logging
- **CORS**: Cross-origin resource sharing enabled

## 📋 API Endpoints

### Users Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `GET` | `/api/users` | Get all users with filters | Query params |
| `GET` | `/api/users/:id` | Get user by ID | - |
| `POST` | `/api/users` | Create new user | User data |
| `PUT` | `/api/users/:id` | Update user | User data |
| `DELETE` | `/api/users/:id` | Delete user | - |

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information |
| `GET` | `/health` | Health check |

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📊 Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 API Usage Examples

### 1. Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Users

```bash
curl http://localhost:3000/api/users
```

**With Filters:**
```bash
curl "http://localhost:3000/api/users?name=John&minAge=25&page=1&limit=10"
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Get User by ID

```bash
curl http://localhost:3000/api/users/1
```

### 4. Update User

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "age": 31
  }'
```

### 5. Delete User

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## 🔍 Query Parameters

### User Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `name` | string | Filter by name (partial match) | `?name=John` |
| `email` | string | Filter by email (partial match) | `?email=example.com` |
| `minAge` | number | Minimum age | `?minAge=18` |
| `maxAge` | number | Maximum age | `?maxAge=65` |
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10, max: 100) | `?limit=20` |

## 📝 Data Models

### User Object

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}
```

### Create User Request

```typescript
interface CreateUserRequest {
  name: string;    // Required, non-empty string
  email: string;   // Required, valid email format
  age: number;     // Required, 0-150
}
```

### Update User Request

```typescript
interface UpdateUserRequest {
  name?: string;   // Optional, non-empty string
  email?: string;  // Optional, valid email format
  age?: number;    // Optional, 0-150
}
```

## ⚠️ Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## 🛠 Development

### Project Structure

```
src/
├── controllers/     # Request handlers
├── database/        # Database configuration
├── middleware/      # Custom middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript interfaces
└── server.ts        # Main server file
```

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Database

The SQLite database file is automatically created at `data/users.db` when the server starts.

## 🔒 Security Features

- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **CORS**: Configurable cross-origin requests

## 📈 Performance

- **Pagination**: Efficient data retrieval
- **Indexed Queries**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Request Logging**: Monitor API usage

## 🧪 Testing

You can test the API using:

1. **curl** (command line)
2. **Postman** (GUI)
3. **Thunder Client** (VS Code extension)
4. **Any HTTP client**

## 📄 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy coding! 🚀**
