
# Example Node server

## Installation
```bash
cd backend
npm install
npm start
```

## API docs (Swagger)
http://localhost:3000/api/v1/api-docs  

## Usage Examples

**Status (health check)**
```bash
curl -X GET http://localhost:3000/api/v1/status
```

**Register user**
```bash
curl -X POST http://localhost:3000/api/v1/register \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "admin123"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/v1/login \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "admin123"}'
```

**Access protected route (/profile)**
```bash
curl -X GET http://localhost:3000/api/v1/profile \
-H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Logout (client should delete token)**
```bash
curl -X POST http://localhost:3000/api/v1/logout
```
