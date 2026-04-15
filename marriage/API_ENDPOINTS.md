# API Endpoints Reference

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
}

Response: 201 Created
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "SecurePass123"
}

Response: 200 OK
{
    "success": true,
    "message": "Login successful",
    "data": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isPremium": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
    "success": true,
    "data": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "userType": "user",
        "status": "active",
        ...
    }
}
```

### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer <token>

Response: 200 OK
{
    "success": true,
    "message": "Token refreshed",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Templates

### List All Templates (Public)
```http
GET /templates?category=RESUME&search=professional&page=1&limit=10&sort=-createdAt
Content-Type: application/json

Query Parameters:
- category: BIODATA | RESUME | COVER_LETTER | WEDDING_CARD | INVITATION
- search: string (searches title, description, tags)
- page: number (default: 1)
- limit: number (default: 10)
- sort: -createdAt | rating | downloads

Response: 200 OK
{
    "success": true,
    "data": [
        {
            "id": "...",
            "title": "Modern Resume",
            "category": "RESUME",
            "description": "Professional modern resume template",
            "thumbnail": "...",
            "isPaid": true,
            "price": 9.99,
            "downloads": 150,
            "rating": 4.5,
            "tags": ["professional", "modern"],
            "createdBy": {
                "id": "...",
                "name": "Admin User"
            },
            "createdAt": "2026-04-07T..."
        }
    ],
    "pagination": {
        "total": 45,
        "page": 1,
        "limit": 10,
        "pages": 5
    }
}
```

### Get Single Template
```http
GET /templates/:templateId
Content-Type: application/json

Response: 200 OK
{
    "success": true,
    "data": {
        "id": "...",
        "title": "Modern Resume",
        "category": "RESUME",
        "content": { /* JSON structure */ },
        "isPaid": true,
        "price": 9.99,
        "downloads": 150,
        "rating": 4.5,
        "ratings": [
            {
                "userId": "...",
                "score": 5,
                "review": "Excellent template!",
                "createdAt": "2026-04-07T..."
            }
        ],
        "createdBy": { /* User data */ },
        "createdAt": "2026-04-07T..."
    }
}
```

### Create Template (Protected)
```http
POST /templates
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Modern Resume",
    "description": "Professional modern resume template",
    "category": "RESUME",
    "content": {
        "sections": [
            {
                "id": "header",
                "label": "Header",
                "fields": ["name", "email", "phone"]
            },
            {
                "id": "summary",
                "label": "Summary",
                "fields": ["summary"]
            }
        ]
    },
    "isPaid": false,
    "price": 0,
    "tags": ["professional", "modern"]
}

Response: 201 Created
{
    "success": true,
    "message": "Template created successfully",
    "data": { /* Created template */ }
}
```

### Update Template (Protected, Creator Only)
```http
PUT /templates/:templateId
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Updated Modern Resume",
    "description": "Updated description",
    "isPaid": true,
    "price": 9.99
}

Response: 200 OK
{
    "success": true,
    "message": "Template updated successfully",
    "data": { /* Updated template */ }
}
```

### Delete Template (Protected, Creator Only)
```http
DELETE /templates/:templateId
Authorization: Bearer <token>

Response: 200 OK
{
    "success": true,
    "message": "Template deleted successfully"
}
```

### Get User's Templates (Protected)
```http
GET /templates/user/my-templates
Authorization: Bearer <token>

Response: 200 OK
{
    "success": true,
    "data": [ /* Array of user's templates */ ]
}
```

### Rate/Review Template (Protected)
```http
POST /templates/:templateId/rate
Authorization: Bearer <token>
Content-Type: application/json

{
    "score": 5,
    "review": "Excellent template, very useful!"
}

Response: 200 OK
{
    "success": true,
    "message": "Rating added successfully",
    "data": { /* Updated template with new rating */ }
}
```

---

## Authentication Header

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Token format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OWZkZjc5OTIwNDk3OjAxZjJjNGZiMDU2Yjg2NjM1IiwiHrvAMTc0NjMyNDk0OCwiaWF0IjoxNzQ2NjQwMDAwfQ.7H3Kx8nQ2...
```

---

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
    "success": false,
    "message": "Validation error",
    "details": [
        {
            "field": "email",
            "message": "\"email\" must be a valid email"
        }
    ]
}
```

### 401 Unauthorized
```json
{
    "success": false,
    "message": "No token provided, authorization denied"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Access denied. Insufficient permissions"
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "Template not found"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Error creating template",
    "error": "Detailed error message"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### List Templates
```bash
curl -X GET "http://localhost:3000/api/v1/templates?category=RESUME&page=1&limit=10" \
  -H "Content-Type: application/json"
```

### Create Template
```bash
curl -X POST http://localhost:3000/api/v1/templates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Modern Resume",
    "category": "RESUME",
    "content": {"sections": []},
    "isPaid": false,
    "tags": ["professional"]
  }'
```

---

## Swagger/OpenAPI Documentation

Access interactive API documentation:
```
http://localhost:3000/api-docs
```

Try out endpoints directly in Swagger UI!

---

## Rate Limiting (Future Phase)

Not yet implemented. Will add in Phase 2.

## Pagination

- Default page: 1
- Default limit: 10
- Max limit: 100

Example response:
```json
{
    "pagination": {
        "total": 45,
        "page": 1,
        "limit": 10,
        "pages": 5
    }
}
```

