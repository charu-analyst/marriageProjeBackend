# Swagger Quick Reference Card

## 🎯 Access Points

```
Swagger UI:           http://localhost:8046/api-docs
JSON Spec:            http://localhost:8046/api-docs/swagger.json
API Root:             http://localhost:8046
Health Check:         http://localhost:8046/health
```

---

## 🔑 How to Get JWT Token

### Option 1: Signup
```
POST /api/v1/auth/signup

Body:
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "YourPassword123",
  "confirmPassword": "YourPassword123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGci..."  ← COPY THIS
  }
}
```

### Option 2: Login
```
POST /api/v1/auth/login

Body:
{
  "email": "you@example.com",
  "password": "YourPassword123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGci..."  ← COPY THIS
  }
}
```

---

## 🔐 Using JWT in Swagger UI

1. **Open Swagger UI**: http://localhost:8046/api-docs
2. **Click "Authorize" button** (top right)
3. **Paste token in format**:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Click "Authorize"**
5. **Protected endpoints now work automatically**

---

## 📌 All Endpoints at a Glance

### Auth Endpoints

| Endpoint | Method | Protected | Purpose |
|----------|--------|-----------|---------|
| `/auth/signup` | POST | ❌ | Create new account |
| `/auth/login` | POST | ❌ | Login to account |
| `/auth/me` | GET | ✅ | View your profile |
| `/auth/refresh` | POST | ✅ | Get new JWT token |

### Template Endpoints

| Endpoint | Method | Protected | Purpose |
|----------|--------|-----------|---------|
| `/templates` | GET | ❌ | List all templates |
| `/templates` | POST | ✅ | Create template |
| `/templates/:id` | GET | ❌ | View template |
| `/templates/:id` | PUT | ✅ | Edit template |
| `/templates/:id` | DELETE | ✅ | Delete template |
| `/templates/:templateId/rate` | POST | ✅ | Rate template |
| `/templates/user/my-templates` | GET | ✅ | Your templates |
| `/templates/featured/list` | GET | ❌ | Featured templates |
| `/templates/top-rated/list` | GET | ❌ | Top rated |
| `/templates/category/:category` | GET | ❌ | By category |
| `/templates/search` | GET | ❌ | Search templates |

---

## 🧪 Test Workflow

### Step 1: Create Account
```
POST /auth/signup
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123456",
  "confirmPassword": "Test123456"
}
```

### Step 2: Copy Token
From response, save the `token` value

### Step 3: Authorize in Swagger
- Click Authorize button
- Paste: `Bearer <your-token>`

### Step 4: Create Template
```
POST /templates
{
  "title": "My Resume",
  "description": "Professional resume",
  "category": "RESUME",
  "content": {"sections": []},
  "isPaid": false,
  "tags": ["professional"]
}
```

### Step 5: Search Template
```
GET /templates/search?q=resume&limit=5
```

### Step 6: Rate Template
```
POST /templates/{templateId}/rate
{
  "score": 5,
  "review": "Excellent template!"
}
```

---

## 📊 Request Format

All requests use JSON:

```
Content-Type: application/json
Authorization: Bearer <token>  (for protected endpoints)

Body: JSON object
```

---

## ✅ Response Format

### Success (200, 201)
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Success message"
}
```

### Error (400, 404, 500)
```json
{
  "success": false,
  "error": "What went wrong"
}
```

---

## 🔍 Query Parameters

### GET /templates
```
?category=RESUME           Filter by category
?search=modern            Search in templates
?page=1                   Page number (default: 1)
?limit=10                 Items per page (default: 10)
```

### GET /templates/search
```
?q=wedding               Search term (required)
?limit=20               Number of results
```

### GET /templates/category/:category
```
?limit=10               Number of results
```

### GET /templates/featured/list
```
?limit=6                Number of featured templates
```

### GET /templates/top-rated/list
```
?limit=6                Number of top templates
```

---

## 🏷️ Template Categories

```
BIODATA
RESUME
COVER_LETTER
WEDDING_CARD
INVITATION
```

---

## ⭐ Rating Scale

```
1 - Poor
2 - Fair
3 - Good
4 - Very Good
5 - Excellent
```

---

## 🔐 User Types

```
USER         Free user
PREMIUM      Premium subscriber
ADMIN        Administrator
```

---

## 👤 User Properties

```
_id                  MongoDB ID
name                 Full name
email                Email address
phone                Phone number (optional)
profilePicture       Avatar URL (optional)
dateOfBirth          Birth date (optional)
gender               MALE, FEMALE, OTHER
userType             USER, PREMIUM, ADMIN
isPremium            Boolean premium status
premiumExpiresAt      Subscription expiry date
authProvider         LOCAL or GOOGLE
createdAt            Account creation date
updatedAt            Last update date
```

---

## 📦 Template Properties

```
_id                  MongoDB ID
title                Template name
description          Template details
category             Template type
content              Template data/structure
previewUrl           Preview image URL
isPaid               Boolean price flag
price                Price if paid
tags                 Search keywords
createdBy            Creator user object
views                View count
downloads            Download count
rating               Average rating (1-5)
ratings              Array of user ratings
isFeatured           Boolean featured status
isActive             Boolean active status
version              Version number
createdAt            Creation date
updatedAt            Last update date
```

---

## 🚨 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Invalid data | Check JSON format in body |
| 401 Unauthorized | Missing token | Click Authorize button |
| 403 Forbidden | Not token owner | Use correct token |
| 404 Not Found | Resource missing | Check ID is correct |
| 422 Unprocessable | Validation failed | Check required fields |
| 500 Server Error | Server issue | Check server logs |

---

## 🎮 Interactive Testing

In Swagger UI for any endpoint:

1. **Click endpoint** to expand
2. **Click "Try it out"**
3. **Fill in parameters**:
   - URL parameters: `{id}`, `{category}`
   - Query parameters: `?page=1`
   - Body: JSON object
4. **Click "Execute"**
5. **View response** below

---

## 🔗 Related Documentation

- **SWAGGER_GUIDE.md** - Detailed implementation guide
- **FILE_GUIDE.md** - Project structure
- **ARCHITECTURE.md** - System design
- **SERVICES_GUIDE.md** - Backend services
- **SERVICES_QUICK_REFERENCE.md** - Service functions

---

## ⚡ Pro Tips

1. **Save tokens** to reuse across tests
2. **Bookmark Swagger UI** for quick access
3. **Test GET** endpoints first (no auth needed)
4. **Use Authorize** for all protected tests
5. **Check response schemas** in "Responses" section
6. **Copy-paste examples** from documentation

---

## 🚀 Start Testing

1. Run: `npm run dev`
2. Open: `http://localhost:8046/api-docs`
3. Try: Create account → Get token → Authorize → Test endpoints

**Happy testing!** ✨

