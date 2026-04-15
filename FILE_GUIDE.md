# File Structure & Purpose Guide

## Project Root

```
marriage/
├── 📄 package.json                    Main project config, dependencies
├── 📄 .env.example                    Environment variables template
├── 📄 index.js                        Entry point (imports server/index.js)
├── 📄 bitbucket-pipelines.yml         CI/CD configuration
├── 📄 gitignore                       Git ignore rules
├── 📄 api.yaml                        API specification
│
├── 📁 config/
│   └── 📄 config.js                   Database URL & global config
│
├── 📁 assets/
│   ├── 📄 response.js                 Response utilities
│   └── 📄 responseMessage.js          Message constants
│
├── 📁 server/
│   ├── 📄 index.js                    Server entry (imports common/server.js)
│   ├── 📄 routes.js                   [Empty] - reserved for main router
│   │
│   ├── 📁 common/
│   │   └── 📄 server.js               🔧 Express app setup, middleware, routes
│   │
│   ├── 📁 dbConnection/
│   │   └── 📄 connection.js           🔧 MongoDB connection logic
│   │
│   ├── 📁 enums/
│   │   ├── 📄 index.js                ✨ NEW: Centralized enum exports
│   │   ├── 📄 gender.js               ✨ UPDATED: ES6 module - MALE, FEMALE, OTHER
│   │   ├── 📄 userType.js             ✨ UPDATED: ES6 module - USER, ADMIN, etc
│   │   ├── 📄 status.js               ✨ UPDATED: ES6 module - ACTIVE, INACTIVE, etc
│   │   ├── 📄 authProvider.js         ✨ UPDATED: ES6 module - LOCAL, GOOGLE, FIREBASE
│   │   ├── 📄 templateCategory.js     ✨ NEW: BIODATA, RESUME, COVER_LETTER, etc
│   │   ├── 📄 paymentStatus.js        ✨ NEW: PENDING, SUCCESS, FAILED, etc
│   │   ├── 📄 paymentMethod.js        ✨ NEW: STRIPE, RAZORPAY, PAYPAL, etc
│   │   └── 📄 subscriptionStatus.js   ✨ NEW: ACTIVE, EXPIRED, CANCELLED, etc
│   │
│   ├── 📁 middleware/
│   │   ├── 📄 auth.js                 ✨ NEW: JWT generation, protection, authorization
│   │   └── 📄 validation.js           ✨ NEW: Request validation with Joi schemas
│   │
│   ├── 📁 model/
│   │   ├── 📄 index.js                ✨ NEW: Centralized model exports
│   │   ├── 📄 user.js                 ✨ UPDATED: User model with bcrypt, OAuth, refs
│   │   ├── 📄 template.js             ✨ UPDATED: Template model with ratings, category
│   │   ├── 📄 transactions.js         ✨ NEW: Payment transaction model
│   │   ├── 📄 userWallet.js           ✨ NEW: Wallet/balance tracking model
│   │   ├── 📄 subscription.js         ✨ NEW: Subscription plans model
│   │   └── 📄 coupon.js               ✨ NEW: Coupon/discount model
│   │
│   ├── 📁 api/v1/
│   │   ├── 📁 controller/
│   │   │   ├── 📄 authController.js   ✨ NEW: Signup, login, refresh, getMe logic
│   │   │   └── 📄 templateController.js  ✨ NEW: Template CRUD & rating logic
│   │   │
│   │   └── 📁 routes/
│   │       ├── 📄 authRoutes.js       ✨ NEW: Auth endpoints with Swagger docs
│   │       └── 📄 templateRoutes.js   ✨ NEW: Template endpoints with Swagger docs
│   │
│   ├── 📁 services/
│   │   └── [Empty] - for business logic
│   │
│   └── 📁 helper/
│       └── [Empty] - for utility functions
│
└── 📁 Documentation
    ├── 📘 DEVELOPMENT_ROADMAP.md      5-phase development plan
    ├── 📘 MODELS_ENUMS_GUIDE.md       Complete model & enum documentation
    ├── 📘 SETUP_SUMMARY.md            Quick setup reference
    ├── 📘 ENUMS_REFERENCE.md          Enum values quick lookup
    ├── 📘 DATABASE_SCHEMA.md          ER diagrams & relationships
    ├── 📘 API_ENDPOINTS.md            Full API documentation with examples
    └── 📘 CHECKLIST.md                Project progress checklist
```

---

## File Categories

### 🔧 Core Infrastructure (Setup)
- `package.json` - Dependencies & scripts
- `config/config.js` - Global configuration
- `server/common/server.js` - Express app initialization
- `server/dbConnection/connection.js` - MongoDB connection

### 🗃️ Database Models
- `server/model/user.js` - User model with auth
- `server/model/template.js` - Template catalog model
- `server/model/transactions.js` - Payment tracking
- `server/model/userWallet.js` - Balance tracking
- `server/model/subscription.js` - Subscription plans
- `server/model/coupon.js` - Discount codes
- `server/model/index.js` - Centralized exports

### 📋 Enums (Constants)
- `server/enums/gender.js` - Gender values
- `server/enums/userType.js` - User role values
- `server/enums/status.js` - Status values
- `server/enums/authProvider.js` - Auth provider types
- `server/enums/templateCategory.js` - Template categories
- `server/enums/paymentStatus.js` - Payment statuses
- `server/enums/paymentMethod.js` - Payment methods
- `server/enums/subscriptionStatus.js` - Subscription statuses
- `server/enums/index.js` - Centralized exports

### 🛡️ Authentication & Validation
- `server/middleware/auth.js` - JWT & authorization
- `server/middleware/validation.js` - Joi validation schemas

### 🔌 API Routes & Controllers
- `server/api/v1/routes/authRoutes.js` - Auth endpoints
- `server/api/v1/routes/templateRoutes.js` - Template endpoints
- `server/api/v1/controller/authController.js` - Auth logic
- `server/api/v1/controller/templateController.js` - Template logic

### 🛎️ Services (Database Query Layer)
- `server/api/v1/services/index.js` - **NEW**: Centralized exports
- `server/api/v1/services/authService.js` - **NEW**: User operations (18 functions)
- `server/api/v1/services/templateService.js` - **NEW**: Template operations (24 functions)

### 📚 Documentation
- `DEVELOPMENT_ROADMAP.md` - 5-phase development plan
- `MODELS_ENUMS_GUIDE.md` - Model & enum reference
- `SETUP_SUMMARY.md` - Quick setup guide
- `ENUMS_REFERENCE.md` - Enum values lookup
- `DATABASE_SCHEMA.md` - Database relationships
- `API_ENDPOINTS.md` - API documentation
- `CHECKLIST.md` - Project progress

---

## File Purposes & Relationships

### Authentication Flow
```
authRoutes.js (routes)
    ↓
authController.js (HTTP logic)
    ↓
authService.js (Database queries)
    ↓
User.js (Model)
    ↓
MongoDB
```

### Template Management Flow
```
templateRoutes.js (routes)
    ↓
templateController.js (HTTP logic)
    ↓
templateService.js (Database queries)
    ↓
Template.js (Model)
    ↓
MongoDB
```

### Database Models Chain
```
User → (creates) → Template
User → (makes) → Transaction
User → (has) → UserWallet
User → (subscribes to) → Subscription
Transaction → (uses) → Coupon
```

---

## Import Examples

### Centralized Model Imports
```javascript
// In controllers or services
import { 
    User, 
    Template, 
    Transaction, 
    UserWallet, 
    Subscription, 
    Coupon 
} from '../model/index.js';
```

### Centralized Enum Imports
```javascript
// In validation or controllers
import { 
    userType, 
    status, 
    templateCategory, 
    paymentStatus 
} from '../enums/index.js';
```

### Individual Imports (Alternative)
```javascript
import User from '../model/user.js';
import templateCategory from '../enums/templateCategory.js';
```

---

## How Each File Contributes to Phases

### Phase 1 (Auth & Templates)
- ✅ `user.js` - User authentication
- ✅ `template.js` - Template storage
- ✅ `authRoutes.js`, `authController.js` - Auth API
- ✅ `templateRoutes.js`, `templateController.js` - Template API
- ✅ `auth.js`, `validation.js` - Security & validation

### Phase 2 (Editor & Export)
- 🔄 Will extend `template.js` with version tracking
- 🔄 New upload endpoints in `templateRoutes.js`
- 🔄 New controllers for PDF/DOCX generation

### Phase 3 (Payments)
- ✅ `transactions.js` - Payment tracking
- ✅ `userWallet.js` - Balance management
- ✅ `subscription.js` - Plans & subscriptions
- ✅ `coupon.js` - Discounts
- 🔄 New payment routes & controllers

### Phase 4 (AI)
- 🔄 New AI service files
- 🔄 New AI controller methods
- 🔄 Extend `user.js` with AI credits

### Phase 5 (Admin)
- 🔄 New admin routes
- 🔄 Admin controller methods
- 🔄 Analytics models

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Models | Singular, PascalCase | `User.js`, `Template.js` |
| Enums | Singular, camelCase | `gender.js`, `userType.js` |
| Controllers | Singular + Controller | `userController.js` |
| Routes | Plural + Routes | `userRoutes.js` |
| Middleware | Purpose name | `auth.js`, `validation.js` |
| Services | Singular + Service | `emailService.js` |
| Utils | Purpose name | `helpers.js` |

---

## Key Technologies Per File

| File | Tech | Purpose |
|------|------|---------|
| user.js | Mongoose + bcrypt | Password hashing & auth |
| template.js | Mongoose indexes | Full-text search & performance |
| auth.js | JWT + bcrypt | Token management |
| validation.js | Joi | Request validation |
| authController.js | Express + bcrypt | Auth logic |
| templateController.js | Mongoose + Express | CRUD operations |
| server.js | Express + Swagger | API setup |
| connection.js | Mongoose | DB connection |

---

## Total File Count

- **Core Infrastructure**: 4 files
- **Models**: 7 files
- **Enums**: 9 files
- **Middleware**: 2 files
- **Services**: 3 files ✨ NEW
- **Routes**: 2 files
- **Controllers**: 2 files
- **Documentation**: 11 files
- **Config**: 2 files
- **Total**: 42 files (updated from 35)

---

## Last Updated
7 April 2026

## Status
✅ Phase 1 Backend: COMPLETE
⏳ Phase 1 Frontend: PENDING
⏳ Phase 2-5: NOT STARTED

