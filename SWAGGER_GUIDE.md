# Swagger API Documentation Implementation Guide

## Overview

Swagger (OpenAPI 3.0) is now fully integrated into your API. All endpoints are documented with complete request/response examples, authentication details, and schemas.

---

## 🚀 Quick Start

### Access Swagger UI
```
http://localhost:8046/api-docs
```

### Start the Server
```bash
npm run dev
```

Then open the link above in your browser to view all API endpoints with interactive testing.

---

## 📋 What's Included

### ✅ Complete Documentation
- **Auth Endpoints**: Signup, Login, Get Profile, Refresh Token
- **Template Endpoints**: CRUD operations, Search, Filter, Rate, Featured
- **Request/Response Examples**: Full JSON schemas for all endpoints
- **Authentication**: JWT Bearer token documentation
- **Error Handling**: Standard error response format

### ✅ Interactive Testing
- Try out endpoints directly from Swagger UI
- Test with real parameters and see responses
- No external tools needed

### ✅ API Schemas
- User schema with all properties
- Template schema with nested data
- Error response schema
- Generic response wrapper schema

---

## 🏗️ File Structure

```
config/
  swagger.js                 ← Swagger configuration and schemas

server/
  common/
    server.js               ← Updated with Swagger integration
  api/v1/
    routes/
      authRoutes.js         ← Swagger JSDoc comments
      templateRoutes.js     ← Swagger JSDoc comments
```

---

## 📚 Swagger JSDoc Format

### Basic Endpoint Documentation

```javascript
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, confirmPassword]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/signup', validateRequest(authSchemas.signup), authController.signup);
```

### Protected Endpoint with JWT

```javascript
/**
 * @swagger
 * /api/v1/templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category, content]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template created successfully
 */
router.post('/', protect, validateRequest(templateSchemas.create), templateController.createTemplate);
```

---

## 🔐 Authentication in Swagger

### Get Token
1. Use `/auth/signup` or `/auth/login` endpoint
2. Copy the returned `token` value

### Use Token
1. Click "Authorize" button in Swagger UI
2. Paste token: `Bearer <your-token-here>`
3. All protected endpoints will include the header automatically

---

## 🛣️ Available Endpoints

### Authentication (Auth)

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/auth/signup` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| GET | `/auth/me` | ✅ | Get current user profile |
| POST | `/auth/refresh` | ✅ | Refresh JWT token |

### Templates

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/templates` | ❌ | Get all templates (with filters) |
| GET | `/templates/:id` | ❌ | Get single template |
| POST | `/templates` | ✅ | Create template |
| PUT | `/templates/:id` | ✅ | Update template |
| DELETE | `/templates/:id` | ✅ | Delete template |
| GET | `/templates/user/my-templates` | ✅ | Get user's templates |
| GET | `/templates/featured/list` | ❌ | Get featured templates |
| GET | `/templates/top-rated/list` | ❌ | Get top rated templates |
| GET | `/templates/category/:category` | ❌ | Get templates by category |
| GET | `/templates/search` | ❌ | Search templates |
| POST | `/templates/:templateId/rate` | ✅ | Rate template |

---

## 📝 Swagger Configuration Breakdown

### 1. OpenAPI Definition
```javascript
definition: {
  openapi: '3.0.0',
  info: {
    title: 'Marriage Template Platform API',
    version: '1.0.0',
    description: '...'
  }
}
```

Defines API title, version, and general information.

### 2. Servers
```javascript
servers: [
  {
    url: 'http://localhost:8046/api/v1',
    description: 'Development Server'
  },
  {
    url: 'https://api.marriagetemplate.com/api/v1',
    description: 'Production Server'
  }
]
```

Allows switching between dev/prod servers in Swagger UI.

### 3. Security Schemes
```javascript
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  }
}
```

Defines JWT Bearer authentication method.

### 4. Schemas
```javascript
schemas: {
  User: { /* User schema properties */ },
  Template: { /* Template schema properties */ },
  Error: { /* Error schema */ }
}
```

Reusable data schemas for requests/responses.

### 5. APIs Array
```javascript
apis: [
  './server/api/v1/routes/authRoutes.js',
  './server/api/v1/routes/templateRoutes.js'
]
```

Points to route files with JSDoc comments.

---

## 🔄 Example API Calls

### Signup
```bash
curl -X POST http://localhost:8046/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User created successfully"
}
```

### Create Template (Protected)
```bash
curl -X POST http://localhost:8046/api/v1/templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Professional Resume",
    "description": "Modern professional resume template",
    "category": "RESUME",
    "content": { "sections": ["header", "experience"] },
    "isPaid": false,
    "tags": ["modern", "professional"]
  }'
```

### Search Templates
```bash
curl -X GET "http://localhost:8046/api/v1/templates/search?q=wedding&limit=10"
```

---

## 🛠️ Adding New Endpoints to Swagger

### Step 1: Add JSDoc Comment to Route
```javascript
/**
 * @swagger
 * /api/v1/newfeature/{id}:
 *   get:
 *     summary: Get new feature by ID
 *     tags: [NewFeature]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature retrieved successfully
 */
router.get('/:id', controller.getFeature);
```

### Step 2: Update swagger.js APIs Array
```javascript
apis: [
  './server/api/v1/routes/authRoutes.js',
  './server/api/v1/routes/templateRoutes.js',
  './server/api/v1/routes/newFeatureRoutes.js'  // Add here
]
```

### Step 3: Restart Server
The endpoint will appear in Swagger UI automatically.

---

## 📊 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### List Response (with Pagination)
```json
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  },
  "message": "Items retrieved successfully"
}
```

---

## 🔍 Testing in Swagger UI

### 1. Open Swagger
```
http://localhost:8046/api-docs
```

### 2. Authenticate (for protected endpoints)
- Click "Authorize" button (top right)
- Get token from `/auth/signup` or `/auth/login`
- Enter: `Bearer <token>`
- Click "Authorize"

### 3. Test Endpoint
- Expand endpoint
- Click "Try it out"
- Fill in parameters
- Click "Execute"
- View response

---

## 📈 Swagger Features

### ✨ Interactive Testing
Try endpoints without external tools

### 📖 Auto-Generated Documentation
All endpoints documented from JSDoc comments

### 🔐 Built-in Authentication
Easy JWT token management

### 🎯 Parameter Validation
Clear required/optional parameters

### 📋 Schema References
Reusable data schemas

### 🖥️ Server Selection
Switch between dev/prod easily

---

## 🚀 Production Deployment

Update server URL in `config/swagger.js`:

```javascript
servers: [
  {
    url: 'https://api.marriagetemplate.com/api/v1',
    description: 'Production Server'
  }
]
```

Swagger will use production URL by default.

---

## 🐛 Troubleshooting

### Swagger UI not loading
- Ensure `swagger-ui-express` is installed: `npm install swagger-ui-express`
- Check server is running on port 8046
- Clear browser cache

### Endpoints not appearing
- Add JSDoc comments to route file
- Update `apis` array in `config/swagger.js`
- Restart server with `npm run dev`

### Authentication not working
- Token must start with `Bearer `
- Format: `Bearer <your-jwt-token>`
- Token from `/auth/signup` or `/auth/login`

### CORS errors
CORS is already handled by Express middleware. If issues persist, check headers in browser console.

---

## 📚 Documentation Files

Related documentation:
- `SERVICES_GUIDE.md` - Service layer functions
- `ARCHITECTURE.md` - Application architecture
- `SERVICES_QUICK_REFERENCE.md` - Developer reference
- `SERVICES_IMPLEMENTATION.md` - Service layer summary
- `FILE_GUIDE.md` - File structure overview

---

## 🎯 What's Next

### For Phase 2 (Editor)
- Add editor endpoints to Swagger
- Document live preview API
- Add WebSocket endpoints (if using real-time sync)

### For Phase 3 (Payments)
- Add payment endpoints
- Document transaction flow
- Add subscription endpoints

### For Phase 4+ (Advanced)
- Add AI/Claude integration endpoints
- Document analytics endpoints
- Add admin panel routes

---

## 📞 Quick Links

| Link | Purpose |
|------|---------|
| `http://localhost:8046/api-docs` | Swagger UI |
| `http://localhost:8046/api-docs/swagger.json` | Swagger JSON spec |
| `http://localhost:8046/health` | Health check |
| `http://localhost:8046/` | API info |

---

## ✅ Checklist

- ✅ Swagger configuration created
- ✅ Routes documented with JSDoc
- ✅ Server integrated with Swagger UI
- ✅ Authentication documented
- ✅ All endpoints documented
- ✅ Schemas defined
- ✅ Development & Production URLs configured
- ✅ Error handling documented

Your API is now fully documented and ready for frontend integration! 🎉

