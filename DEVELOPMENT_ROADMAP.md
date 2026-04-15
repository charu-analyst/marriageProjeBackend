# Template Marketplace + Generator Platform - Development Roadmap

## Overview
A comprehensive template marketplace where users can browse, customize, and download templates (marriage biodata, resume, cover letter, etc.), with AI assistance for personalized content generation.

---

## Phase 1: Auth System & Template CRUD API ✅ (Scaffolding Complete)

### ✅ Completed
- **User Model**: Authentication with bcrypt hashing, role-based access (user, admin, premium)
- **Template Model**: Schema with categories, pricing, ratings, search indexes
- **JWT Auth Middleware**: Token generation, protection, role-based authorization
- **Auth Routes**: Signup, login, token refresh, get profile
- **Template Routes**: CRUD operations, search/filter/pagination, user templates, rating system
- **Validation**: Joi schemas for auth and template endpoints
- **API Documentation**: Swagger/OpenAPI setup with full endpoint documentation

### Next Steps - Phase 1 Frontend
- [ ] Setup React + Vite frontend
- [ ] Create login/signup pages
- [ ] Build template browse interface with filters
- [ ] Create template upload form
- [ ] Implement template preview page
- [ ] User dashboard with my templates

---

## Phase 2: Live Editor & Export

### Backend Tasks
- [ ] Setup file storage (AWS S3 or local)
- [ ] Create file upload endpoints
- [ ] Implement PDF generation (using libraries like `pdfkit` or `puppeteer`)
- [ ] Implement DOCX export (using `docx` library)
- [ ] Create edit history tracking
- [ ] Template version management

### Frontend Tasks
- [ ] Build form-based template editor with field mapping
- [ ] Live preview pane that updates in real-time
- [ ] Export modal with PDF/DOCX download
- [ ] Template history/version selector
- [ ] Save draft functionality

### Dependencies to Add
```bash
npm install pdfkit docx puppeteer aws-sdk multer
```

---

## Phase 3: Payment Integration

### Backend Tasks
- [ ] Implement Stripe/Razorpay SDK integration
- [ ] Create payment routes and controllers
- [ ] Setup Transaction model for order tracking
- [ ] Implement subscription model (free/paid templates)
- [ ] Add payment webhook handlers
- [ ] Implement coupon/discount system

### Frontend Tasks
- [ ] Payment modal/checkout page
- [ ] Subscription plan selector
- [ ] Order history page
- [ ] Invoice generation
- [ ] Payment method management

### Database Updates
- Extend User model with subscription fields
- Create Transaction model
- Add Coupon model

---

## Phase 4: AI Assistant (Claude API)

### Backend Tasks
- [ ] Setup Claude API client
- [ ] Create AI prompt templates for each template type
- [ ] Implement streaming response endpoints
- [ ] Create content suggestion endpoints
- [ ] Add usage tracking and rate limiting
- [ ] Implement caching for common requests

### Frontend Tasks
- [ ] AI sidebar in editor with suggestions
- [ ] Streaming response UI (typewriter effect)
- [ ] Multi-turn conversation interface
- [ ] Auto-fill field suggestions
- [ ] AI credits/usage dashboard

### Dependencies to Add
```bash
npm install @anthropic-ai/sdk
```

---

## Phase 5: Admin Dashboard

### Backend Tasks
- [ ] Create admin routes and controllers
- [ ] Implement analytics endpoints (user stats, revenue, popular templates)
- [ ] Create template moderation system
- [ ] Implement user management endpoints
- [ ] Add reporting system

### Frontend Tasks
- [ ] Admin login
- [ ] Dashboard with key metrics
- [ ] Template management panel
- [ ] User management interface
- [ ] Analytics & reports
- [ ] Content moderation queue
- [ ] Revenue/subscription tracking

### Database Updates
- Add admin role permissions
- Create Analytics model
- Add moderation flags to Template model

---

## Project Structure (Current)

```
marriage/
├── server/
│   ├── api/v1/
│   │   ├── controller/
│   │   │   ├── authController.js ✅
│   │   │   └── templateController.js ✅
│   │   └── routes/
│   │       ├── authRoutes.js ✅
│   │       └── templateRoutes.js ✅
│   ├── common/
│   │   └── server.js ✅
│   ├── dbConnection/
│   │   └── connection.js ✅
│   ├── middleware/
│   │   ├── auth.js ✅
│   │   └── validation.js ✅
│   ├── model/
│   │   ├── user.js ✅
│   │   ├── template.js ✅
│   │   ├── transactions.js (Phase 3)
│   │   └── userWallet.js (Phase 3)
│   ├── enums/
│   ├── helper/
│   └── index.js
├── config/
│   └── config.js ✅
├── assets/
├── .env.example ✅
├── package.json
└── index.js
```

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **API Documentation**: Swagger/OpenAPI
- **File Upload**: Multer + AWS S3
- **PDF Export**: PDFKit / Puppeteer
- **DOCX Export**: docx library
- **Payment**: Stripe / Razorpay SDK
- **AI**: Claude API (@anthropic-ai/sdk)

### Frontend (Phase 1)
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Zustand / Redux (to decide)
- **Form Handling**: React Hook Form + Yup/Zod

### DevOps
- **CI/CD**: Bitbucket Pipelines (already configured)
- **Hosting**: TBD

---

## Database Schema Overview

### User
- ID, Name, Email, Password, Role, Avatar
- isPremium, premiumExpiresAt
- Templates array, Purchases array
- Timestamps

### Template
- ID, Title, Description, Category
- Content (JSON/Mixed), Thumbnail
- CreatedBy (User ref), Downloads, Rating
- Ratings array (with reviews)
- Tags, isPaid, Price
- FileUrl, isActive
- Timestamps

### Transaction (Phase 3)
- ID, UserId, TemplateId, Amount
- PaymentStatus, PaymentMethod
- TransactionId, Timestamps

### Coupon (Phase 3)
- ID, Code, Discount%, ValidUntil
- MaxUsage, CurrentUsage

---

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/signup` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get profile (protected)
- `POST /api/v1/auth/refresh` - Refresh token (protected)

### Templates
- `GET /api/v1/templates` - List all (search, filter, paginate)
- `GET /api/v1/templates/:id` - Get single
- `POST /api/v1/templates` - Create (protected)
- `PUT /api/v1/templates/:id` - Update (protected, creator only)
- `DELETE /api/v1/templates/:id` - Delete (protected, creator only)
- `GET /api/v1/templates/user/my-templates` - Get user's templates (protected)
- `POST /api/v1/templates/:templateId/rate` - Rate template (protected)

---

## Next Steps

1. **Install missing dependencies** (bcrypt):
   ```bash
   npm install bcrypt
   ```

2. **Setup environment variables**:
   - Copy `.env.example` to `.env`
   - Update `MONGO_URI` and `JWT_SECRET`

3. **Test API endpoints** using Swagger UI or Postman:
   - Visit `http://localhost:3000/api-docs` after starting server

4. **Begin Phase 1 Frontend**:
   - Create React + Vite project
   - Setup authentication pages
   - Build template browse interface

---

## Notes

- All endpoints are documented in Swagger UI
- Role-based access control is implemented
- Validation is handled at middleware level
- Error handling follows consistent JSON response format
- Database indexes are optimized for common queries

