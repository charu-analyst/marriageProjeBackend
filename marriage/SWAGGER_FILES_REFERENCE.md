# Swagger Implementation File Structure & Code Reference

## 📁 New Files Created

### 1. `config/swagger.js` - Main Configuration

**What it does:**
- Defines OpenAPI 3.0 specification
- Configures servers (dev & prod)
- Defines security schemes (JWT Bearer)
- Creates reusable schemas
- Points to route files with JSDoc comments

**Key sections:**

```javascript
// 1. API Information
definition: {
  openapi: '3.0.0',
  info: {
    title: 'Marriage Template Platform API',
    version: '1.0.0',
    description: '...'
  },
  ...
}

// 2. Servers Configuration
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

// 3. Security Schemes (JWT)
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  schemas: {
    User: { /* User schema */ },
    Template: { /* Template schema */ },
    Error: { /* Error schema */ }
  }
}

// 4. Route Files with JSDoc
apis: [
  './server/api/v1/routes/authRoutes.js',
  './server/api/v1/routes/templateRoutes.js'
]
```

---

### 2. `SWAGGER_GUIDE.md` - Comprehensive Guide

**Contains:**
- Complete implementation overview
- JSDoc format examples
- Authentication workflow
- All 15 endpoints documented
- Swagger configuration breakdown
- Adding new endpoints guide
- Production deployment info
- Troubleshooting section

**Length:** 400+ lines

---

### 3. `SWAGGER_QUICK_REFERENCE.md` - Quick Reference

**Contains:**
- Quick access points (URLs)
- How to get JWT token
- All endpoints in table format
- Test workflow steps
- Request/response format
- Query parameters
- Common errors
- Pro tips

**Length:** 280+ lines

---

## 🔄 Updated Files

### `server/common/server.js` - Server Integration

**Before:**
```javascript
import express from 'express';
import connectDB from '../dbConnection/connection.js';
const app=express();
const PORT=8046

app.use(express.json());

app.listen(PORT,()=>{
    console.log(`server connected on port ${PORT}`);
    connectDB()
})
```

**After:**
```javascript
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../config/swagger.js';
import connectDB from '../dbConnection/connection.js';
import authRoutes from '../api/v1/routes/authRoutes.js';
import templateRoutes from '../api/v1/routes/templateRoutes.js';

const app = express();
const PORT = 8046;

// Middleware
app.use(express.json());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/templates', templateRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Marriage Template Platform API',
    version: '1.0.0',
    docs: 'http://localhost:8046/api-docs',
    health: 'http://localhost:8046/health'
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Server started on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health\n`);
  connectDB();
});
```

**Changes:**
- ✅ Imported swagger-ui-express and swaggerSpec
- ✅ Imported all routes (authRoutes, templateRoutes)
- ✅ Set up Swagger UI at /api-docs
- ✅ Added Swagger JSON endpoint
- ✅ Registered all route modules
- ✅ Added health check endpoint
- ✅ Added root API info endpoint
- ✅ Enhanced startup logging

---

## 📋 JSDoc Comment Structure

### Example Auth Route Documentation

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
 */
router.post('/signup', validateRequest(authSchemas.signup), authController.signup);
```

### Example Protected Template Route

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
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: object
 *               isPaid:
 *                 type: boolean
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *     responses:
 *       201:
 *         description: Template created successfully
 */
router.post('/', protect, validateRequest(templateSchemas.create), templateController.createTemplate);
```

---

## 🔐 Security Scheme Definition

```javascript
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',                    // HTTP scheme
      scheme: 'bearer',                // Bearer tokens
      bearerFormat: 'JWT',             // JWT tokens
      description: 'JWT Bearer token'
    }
  }
}
```

**Usage in endpoint:**
```javascript
security: [bearerAuth: []]  // Marks endpoint as protected
```

---

## 📦 Schema Definitions

### User Schema
```javascript
User: {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    profilePicture: { type: 'string' },
    dateOfBirth: { type: 'string', format: 'date' },
    gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
    userType: { type: 'string', enum: ['USER', 'PREMIUM', 'ADMIN'] },
    isPremium: { type: 'boolean' },
    premiumExpiresAt: { type: 'string', format: 'date-time' },
    authProvider: { type: 'string', enum: ['LOCAL', 'GOOGLE'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
}
```

### Template Schema
```javascript
Template: {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    category: { 
      type: 'string', 
      enum: ['BIODATA', 'RESUME', 'COVER_LETTER', 'WEDDING_CARD', 'INVITATION'] 
    },
    content: { type: 'object' },
    previewUrl: { type: 'string' },
    isPaid: { type: 'boolean' },
    price: { type: 'number' },
    tags: { type: 'array', items: { type: 'string' } },
    createdBy: { $ref: '#/components/schemas/User' },
    views: { type: 'number' },
    downloads: { type: 'number' },
    rating: { type: 'number' },
    ratings: { type: 'array' },
    isFeatured: { type: 'boolean' },
    isActive: { type: 'boolean' },
    version: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
}
```

---

## 🎯 Server Configuration

### Development Server
```javascript
{
  url: 'http://localhost:8046/api/v1',
  description: 'Development Server'
}
```

### Production Server
```javascript
{
  url: 'https://api.marriagetemplate.com/api/v1',
  description: 'Production Server'
}
```

**In Swagger UI:** Switch between servers using dropdown

---

## 📚 Route Organization by Tags

### Auth Tag
```javascript
tags: [
  {
    name: 'Auth',
    description: 'Authentication endpoints (signup, login, token refresh)'
  }
]
```

**Endpoints:**
- POST /auth/signup
- POST /auth/login
- GET /auth/me
- POST /auth/refresh

### Templates Tag
```javascript
tags: [
  {
    name: 'Templates',
    description: 'Template management endpoints (CRUD, search, rate)'
  }
]
```

**Endpoints:**
- GET /templates
- POST /templates
- GET /templates/:id
- PUT /templates/:id
- DELETE /templates/:id
- GET /templates/user/my-templates
- GET /templates/featured/list
- GET /templates/top-rated/list
- GET /templates/category/:category
- GET /templates/search
- POST /templates/:templateId/rate

---

## 🔗 Import Chain

```
server/common/server.js
  ├── imports: swagger-ui-express
  ├── imports: config/swagger.js
  │   └── uses: authRoutes.js (JSDoc comments)
  │   └── uses: templateRoutes.js (JSDoc comments)
  ├── registers: authRoutes
  ├── registers: templateRoutes
  └── mounts: Swagger UI at /api-docs
```

---

## 🌐 API Access Points

| URL | Purpose | Method |
|-----|---------|--------|
| http://localhost:8046/ | API info | GET |
| http://localhost:8046/health | Health check | GET |
| http://localhost:8046/api-docs | Swagger UI | GET |
| http://localhost:8046/api-docs/swagger.json | OpenAPI spec | GET |
| http://localhost:8046/api/v1/auth/* | Auth routes | POST/GET |
| http://localhost:8046/api/v1/templates/* | Template routes | GET/POST/PUT/DELETE |

---

## 📊 Documentation Files Tree

```
Project Root/
├── config/
│   └── swagger.js                        ← NEW: Swagger configuration (180 lines)
├── SWAGGER_GUIDE.md                      ← NEW: Comprehensive guide (400+ lines)
├── SWAGGER_QUICK_REFERENCE.md            ← NEW: Quick reference (280+ lines)
├── SWAGGER_IMPLEMENTATION_SUMMARY.md     ← NEW: Implementation summary
├── server/
│   ├── common/
│   │   └── server.js                     ← UPDATED: Swagger integration
│   └── api/v1/
│       ├── controller/
│       │   ├── authController.js
│       │   └── templateController.js
│       └── routes/
│           ├── authRoutes.js             ← Contains JSDoc comments
│           └── templateRoutes.js         ← Contains JSDoc comments
└── package.json                          ← Already has swagger packages
```

---

## ✅ Complete Checklist

- ✅ swagger.js configuration created
- ✅ server.js updated with Swagger integration
- ✅ Swagger UI mounted at /api-docs
- ✅ OpenAPI 3.0 specification complete
- ✅ JWT Bearer authentication configured
- ✅ All endpoints documented with JSDoc
- ✅ Reusable schemas defined
- ✅ Development & Production servers configured
- ✅ Comprehensive guides created
- ✅ Quick reference guide created
- ✅ Implementation summary created

---

## 🚀 Start Using

```bash
# Start server
npm run dev

# Access Swagger UI
http://localhost:8046/api-docs

# View OpenAPI spec
http://localhost:8046/api-docs/swagger.json
```

---

## 📖 Reference Files

- **SWAGGER_GUIDE.md** - Full implementation details
- **SWAGGER_QUICK_REFERENCE.md** - Quick lookup guide
- **SWAGGER_IMPLEMENTATION_SUMMARY.md** - What was done summary
- **FILE_GUIDE.md** - Project structure overview
- **ARCHITECTURE.md** - System design

---

**Your API is now fully documented and ready for frontend integration!** ✨

