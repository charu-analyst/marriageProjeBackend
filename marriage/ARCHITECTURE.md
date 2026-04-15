# Service Layer Architecture

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT REQUEST                            │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/v1/auth/signup
│  GET /api/v1/templates
│  PUT /api/v1/templates/:id
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTES LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  authRoutes.js:                                                  │
│  • POST /signup → protect → validate → signupController        │
│  • POST /login → validate → loginController                     │
│  • GET /me → protect → getMeController                          │
│                                                                  │
│  templateRoutes.js:                                             │
│  • GET / → getTemplatesController                              │
│  • POST / → protect → validate → createController              │
│  • PUT /:id → protect → updateController                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CONTROLLERS LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  authController.js:                                              │
│  ├─ signup(req, res)        ─→ Call authService functions      │
│  ├─ login(req, res)         ─→ Call authService functions      │
│  ├─ getMe(req, res)         ─→ Call authService functions      │
│  └─ refreshToken(req, res)  ─→ Call authService functions      │
│                                                                  │
│  templateController.js:                                         │
│  ├─ getTemplates(req, res)       ─→ Call templateService      │
│  ├─ createTemplate(req, res)     ─→ Call both services        │
│  ├─ updateTemplate(req, res)     ─→ Call templateService      │
│  ├─ deleteTemplate(req, res)     ─→ Call both services        │
│  ├─ rateTemplate(req, res)       ─→ Call templateService      │
│  └─ getFeaturedTemplates(req, res)→ Call templateService      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVICES LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  authService.js:                                                 │
│  ├─ findUserByEmail()              (DB Query)                  │
│  ├─ findUserByEmailWithPassword()  (DB Query)                  │
│  ├─ createUser()                   (DB Create)                 │
│  ├─ updateUserById()               (DB Update)                 │
│  ├─ updateUserTemplates()          (DB Update)                 │
│  ├─ verifyPassword()               (Business Logic)            │
│  ├─ generateAuthToken()            (Business Logic)            │
│  └─ updateLastLoggedIn()           (DB Update)                 │
│                                                                  │
│  templateService.js:                                            │
│  ├─ getAllTemplates()              (DB Query + Pagination)     │
│  ├─ getTemplateById()              (DB Query + Populate)       │
│  ├─ createTemplate()               (DB Create)                 │
│  ├─ updateTemplateById()           (DB Update)                 │
│  ├─ deleteTemplateById()           (DB Delete)                 │
│  ├─ incrementTemplateViews()       (DB Update)                 │
│  ├─ addTemplateRating()            (DB Update + Calculation)   │
│  └─ getFeaturedTemplates()         (DB Query + Sort)           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MODELS LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  • User.js         (Schema: name, email, password, ...)        │
│  • Template.js     (Schema: title, category, content, ...)    │
│  • Transaction.js  (Schema: userId, amount, status, ...)      │
│  • UserWallet.js   (Schema: userId, balance, ...)             │
│  • Subscription.js (Schema: userId, planName, ...)            │
│  • Coupon.js       (Schema: code, discount, ...)              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                             │
├─────────────────────────────────────────────────────────────────┤
│  users collection                                                │
│  templates collection                                            │
│  transactions collection                                         │
│  userwallets collection                                          │
│  subscriptions collection                                        │
│  coupons collection                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Service Interaction

### Authentication Flow
```
signup Request
    ↓
authRoutes.js (POST /signup)
    ↓
authController.signup()
    ├→ authService.findUserByEmail()    (Check if email exists)
    ├→ authService.createUser()         (Create new user)
    ├→ authService.generateAuthToken()  (Generate JWT)
    └→ Return JSON response with token
```

### Template Creation Flow
```
createTemplate Request
    ↓
templateRoutes.js (POST /templates)
    ├→ protect middleware (Verify JWT)
    ├→ validateRequest middleware (Validate data)
    └→ templateController.createTemplate()
        ├→ templateService.createTemplate()      (Create template)
        ├→ authService.updateUserTemplates()     (Add to user's templates)
        └→ Return JSON response with template
```

### Template Search Flow
```
search Request
    ↓
templateRoutes.js (GET /templates?search=...)
    ↓
templateController.getTemplates()
    ├→ templateService.getAllTemplates()    (Query with filters)
    └→ Return JSON response with templates & pagination
```

---

## Service Dependencies

```
Controllers
    ↓
    ├─→ authService (for user operations)
    └─→ templateService (for template operations)

Services
    ↓
    ├─→ Models (User, Template, etc.)
    ├─→ Middleware (auth.js for generateToken)
    └─→ Enums (for constants)

Models
    ↓
    └─→ Enums (for validation)
```

---

## Data Flow Example: Create Template

```
REQUEST
{
    "title": "Modern Resume",
    "category": "RESUME",
    "content": {...},
    "isPaid": false
}
    ↓
templateRoutes validates & protects
    ↓
templateController.createTemplate()
    ├─ Receives validated data
    ├─ Extract userId from req.user.id
    │
    ├─ Call: templateService.createTemplate({
    │       title, category, content, isPaid,
    │       createdBy: userId
    │   })
    │   └─ Creates new Template document
    │
    ├─ Call: authService.updateUserTemplates(
    │       userId, templateId, 'push'
    │   )
    │   └─ Adds templateId to user.templates array
    │
    └─ Return response with created template
        {
            "success": true,
            "data": {
                "_id": "...",
                "title": "Modern Resume",
                "category": "RESUME",
                "createdBy": userId,
                ...
            }
        }
```

---

## Error Handling Flow

```
Request Error
    ↓
    ├─→ Validation Error (400)
    │   └─ Controllers handle & return error response
    │
    ├─→ Authentication Error (401)
    │   └─ Middleware handles & return error response
    │
    ├─→ Authorization Error (403)
    │   └─ Controllers check & return error response
    │
    ├─→ Not Found Error (404)
    │   └─ Service returns null, Controller returns error response
    │
    └─→ Server Error (500)
        └─ Try-catch in controllers catches & returns error response
```

---

## Service Method Categories

### Query Methods (Read)
```javascript
// Return data without modification
findUserByEmail()
getTemplateById()
getAllTemplates()
getUserTemplates()
getFeaturedTemplates()
```

### Mutation Methods (Write)
```javascript
// Modify database state
createUser()
createTemplate()
updateUserById()
updateTemplateById()
deleteTemplateById()
```

### Utility Methods
```javascript
// Business logic without direct DB modification
verifyPassword()
generateAuthToken()
isTemplateCreator()
```

### Aggregate Methods
```javascript
// Combine multiple operations
addTemplateRating()    // Updates template + calculates average
incrementTemplateViews()  // Updates counter
```

---

## Performance Optimizations

### Lean Queries
```javascript
// Fast read-only queries (no hydration)
getTemplateByIdLean() → No populate, returns plain objects

// vs

// Full queries with relations
getTemplateById() → With populate, returns Mongoose documents
```

### Pagination
```javascript
getAllTemplates({
    page: 1,
    limit: 10,  // Only fetch needed records
    sort: '-createdAt'
})
```

### Indexes
```
Models have indexes on:
- Frequently searched fields (email, category)
- Foreign keys (createdBy, userId)
- Sorting fields (createdAt, rating)
```

---

## Scalability

### Adding New Service
```
1. Create: server/api/v1/services/newService.js
2. Add export to: server/api/v1/services/index.js
3. Import & use in controllers
```

### Adding New Model
```
1. Create: server/model/newModel.js
2. Create: server/api/v1/services/newService.js (with CRUD functions)
3. Create: server/api/v1/controller/newController.js
4. Create: server/api/v1/routes/newRoutes.js
5. Mount route in server/common/server.js
```

---

## Best Practices

✅ Controllers call services, not models directly  
✅ Services contain all query logic  
✅ Error handling in controllers/middleware  
✅ Enums for constant values  
✅ Validation at route/middleware level  
✅ Authentication/Authorization in middleware  
✅ Services are stateless  
✅ Use lean() for read-only queries  
✅ Proper indexing for performance  
✅ Consistent error responses  

