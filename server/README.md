# Code Snippet API Server

Backend API server for Code Snippet platform built with Express.js, TypeScript, and MongoDB.

## 🚀 Features

- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **TypeScript** - Type-safe development
- ✅ **MongoDB** - NoSQL database with Mongoose ODM
- ✅ **RESTful API** - Clean and organized API structure
- ✅ **Validation** - Request validation with express-validator
- ✅ **Error Handling** - Centralized error handling
- ✅ **Security** - Helmet, CORS protection
- ✅ **Logging** - Morgan HTTP request logger
- ✅ **Compression** - Response compression

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/
│   │   ├── Snippet.ts           # Snippet model
│   │   ├── Like.ts              # Like model
│   │   └── Tag.ts               # Tag model
│   ├── controllers/
│   │   ├── snippetController.ts # Snippet logic
│   │   └── tagController.ts     # Tag logic
│   ├── routes/
│   │   ├── snippetRoutes.ts     # Snippet routes
│   │   ├── tagRoutes.ts         # Tag routes
│   │   └── index.ts             # Route aggregator
│   ├── middleware/
│   │   ├── errorHandler.ts      # Error handling
│   │   └── validation.ts        # Request validation
│   ├── app.ts                   # Express app setup
│   └── index.ts                 # Server entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Steps

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   Edit `.env` file with your settings:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/code-snippet
   CLIENT_URL=http://localhost:3000
   API_VERSION=v1
   ```

5. **Start MongoDB:**
   - Local: `mongod`
   - Or use MongoDB Atlas (cloud)

6. **Run development server:**
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Health Check

```
GET /api/v1/health
```

> **Note:** User management is handled by NextAuth on the client side. The server only stores author information (authorId, authorName, authorImage) within snippets.

### Snippets

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/snippets`               | Create snippet                  |
| GET    | `/snippets`               | Get all snippets (with filters) |
| GET    | `/snippets/:id`           | Get snippet by ID               |
| GET    | `/snippets/user/:userId`  | Get snippets by user            |
| GET    | `/snippets/liked/:userId` | Get liked snippets by user      |
| PUT    | `/snippets/:id`           | Update snippet                  |
| DELETE | `/snippets/:id`           | Delete snippet                  |
| POST   | `/snippets/:id/like`      | Like/Unlike snippet             |

### Tags

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/tags`                | Get all tags (paginated) |
| GET    | `/tags/popular`        | Get popular tags         |
| GET    | `/tags/search?q=query` | Search tags              |

## 📊 Query Parameters

### Pagination

```
?page=1&limit=20
```

### Snippet Filters

```
?language=javascript
?tag=react
?search=keyword
?sort=latest|popular|views
```

## 📦 Request/Response Examples

### Create Snippet

```bash
POST /api/v1/snippets
Content-Type: application/json

{
  "title": "React useState Hook",
  "description": "Example of using useState hook in React",
  "code": "const [count, setCount] = useState(0);",
  "language": "javascript",
  "tags": ["react", "hooks"],
  "authorId": "user123",
  "authorName": "John Doe",
  "complexity": "beginner"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "snippet123",
    "title": "React useState Hook",
    "description": "Example of using useState hook in React",
    "code": "const [count, setCount] = useState(0);",
    "language": "javascript",
    "tags": ["react", "hooks"],
    "authorId": "user123",
    "authorName": "John Doe",
    "likes": 0,
    "views": 0,
    "complexity": "beginner",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Snippets with Filters

```bash
GET /api/v1/snippets?language=javascript&tag=react&sort=popular&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Like Snippet

```bash
POST /api/v1/snippets/snippet123/like
Content-Type: application/json

{
  "userId": "user123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Snippet liked",
  "liked": true,
  "likes": 1
}
```

## 🔒 Security Features

- **Helmet** - Sets security HTTP headers
- **CORS** - Cross-Origin Resource Sharing protection
- **Input Validation** - Request validation with express-validator
- **Error Handling** - Centralized error handling
- **Rate Limiting** - (TODO: Add rate limiting)

## 🗄️ Database Models

> **Note:** User data is managed by NextAuth (Google OAuth) on the client side. The server stores only author information within snippets.

### Snippet Schema

```typescript
{
  title: string
  description: string
  code: string
  language: string
  tags: string[]
  authorId: string
  authorName: string
  authorImage?: string
  likes: number
  views: number
  isPublic: boolean
  complexity: 'beginner' | 'intermediate' | 'advanced'
  createdAt: Date
  updatedAt: Date
}
```

### Like Schema

```typescript
{
  userId: string;
  snippetId: string;
  createdAt: Date;
}
```

### Tag Schema

```typescript
{
  name: string (unique)
  slug: string (unique)
  description?: string
  count: number
  createdAt: Date
  updatedAt: Date
}
```

## 🚧 TODO

- [ ] Add JWT authentication middleware
- [ ] Add rate limiting
- [ ] Add file upload for avatars
- [ ] Add search with Elasticsearch
- [ ] Add caching with Redis
- [ ] Add unit tests
- [ ] Add API documentation (Swagger)
- [ ] Add WebSocket for real-time updates
- [ ] Add email notifications

## 🐛 Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": "Validation errors (if any)"
}
```

HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

## 📚 Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **express-validator** - Validation
- **helmet** - Security
- **cors** - CORS handling
- **morgan** - Logging
- **compression** - Response compression
- **dotenv** - Environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License
