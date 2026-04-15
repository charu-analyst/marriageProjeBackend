# Database Schema Relationships

## Entity-Relationship Diagram (Text)

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER                                   │
├─────────────────────────────────────────────────────────────────┤
│ • _id (PK)                                                       │
│ • name, email, password (bcrypt)                                │
│ • phone, profilePicture, dateOfBirth                            │
│ • gender (enum), googleId, authProvider (enum)                 │
│ • status (enum), userType (enum)                               │
│ • isPremium, premiumExpiresAt                                   │
│ • isVerified, isActive, lastLoggedIn                            │
│ • otp, otpExpireTime                                            │
│ • templates[] (refs) ──────────┐                                │
│ • purchases[] (refs) ──────────┤                                │
│ • timestamps                   │                                │
└─────────────────────────────────┼────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
         ┌──────────────┐  ┌─────────────┐  ┌──────────────┐
         │  TEMPLATE    │  │ TRANSACTION │  │ SUBSCRIPTION │
         ├──────────────┤  ├─────────────┤  ├──────────────┤
         │ • _id (PK)   │  │ • _id (PK)  │  │ • _id (PK)   │
         │ • title      │  │ • userId(FK)├─┘ • userId(FK) │
         │ • category   │  │ • templateId│  │ • planName   │
         │ • content    │  │ • amount    │  │ • price      │
         │ • thumbnail  │  │ • status    │  │ • status     │
         │ • isPaid     │  │ • method    │  │ • startDate  │
         │ • price      │  │ • txnId     │  │ • endDate    │
         │ • createdBy  │  │ • orderId   │  │ • autoRenew  │
         │   (User FK)  │  │ • refund*   │  │ • features[] │
         │ • downloads  │  │ • timestamps   │ • limits*    │
         │ • rating     │  │             │  │ • aiCredits  │
         │ • ratings[]  │  │ ┌───────────┤  └──────────────┘
         │ • tags       │  │ │           │
         │ • isActive   │  │ │ WALLET    │
         │ • isFeatured │  │ ├───────────┤
         │ • fileUrl    │  │ │ • userId  │
         │ • timestamps │  │ │ • balance │
         │             │  │ │ • earned  │
         │ INDEXES:    │  │ │ • spent   │
         │ • Full-text │  │ │ • txns[]  │
         │ • category  │  │ └───────────┘
         │ • createdBy │  │
         │ • rating    │  │ INDEXES:
         │ • featured  │  │ • userId
         │             │  │ • status
         │             │  │ • txnId
         │             │  │ • templateId
         │             │  │
         │             │  └─────────────────────┐
         │             │                        │
         │             │                        ▼
         │             │                ┌──────────────┐
         │             │                │   COUPON     │
         │             │                ├──────────────┤
         │             │                │ • code       │
         │             │                │ • discount*  │
         │             │                │ • maxUsage   │
         │             │                │ • users[]    │
         │             │                │ • valid*     │
         │             │                │ • templates[]│
         │             │                │              │
         │             │                │ INDEXES:     │
         │             │                │ • code       │
         │             │                │ • validUntil │
         │             │                │ • isActive   │
         │             │                └──────────────┘
         │             │
         └─────────────┴──────────────────────────────────────────

LEGEND:
FK = Foreign Key
* = Multiple fields/nested object
[] = Array field
() = Field type/details
```

---

## One-to-Many Relationships

| From | To | Field | Cardinality |
|------|-----|-------|-------------|
| User | Template | createdBy | 1:M |
| User | Transaction | userId | 1:M |
| User | UserWallet | userId | 1:1 |
| User | Subscription | userId | 1:M |
| Template | Transaction | templateId | 1:M |
| Template | Rating | ratings[] | 1:M |
| User | Rating | userId | 1:M |
| Subscription | Transaction | transactionId | 1:1 |

---

## Collections Summary

### 1. Users Collection
- Stores user account information
- Password hashing with bcrypt
- Support for OAuth (Google, Firebase)
- Premium membership tracking
- Linked to templates created and purchases made

### 2. Templates Collection
- Main product catalog
- Supports multiple categories (Biodata, Resume, etc.)
- Stores customizable content as JSON
- Features rating system
- Full-text search on title/description/tags

### 3. Transactions Collection
- Payment/order records
- Multiple payment method support
- Refund tracking
- Links user to template/subscription purchases

### 4. UserWallet Collection
- 1:1 relationship with User
- Tracks account balance and statistics
- Payment history reference

### 5. Subscriptions Collection
- User subscription plans
- Auto-renewal support
- Feature/limit tracking (downloads, AI credits)
- Premium status management

### 6. Coupons Collection
- Discount codes
- Usage tracking per user
- Time-bound validity
- Category/template-specific discounts

---

## Indexes for Performance

### User
```
- Single: email, googleId
```

### Template
```
- Text: title, description, tags
- Compound: category + isActive
- Single: createdBy, isFeatured, rating
```

### Transaction
```
- Compound: userId + createdAt
- Single: status, transactionId, templateId
```

### UserWallet
```
- Single: userId
```

### Subscription
```
- Single: userId, status
- Single: endDate (for expiry checks)
```

### Coupon
```
- Single: code
- Single: validUntil, isActive
```

---

## Data Flow Examples

### User Registration Flow
```
1. POST /auth/signup
2. Create User document
3. Create UserWallet (1:1)
4. Return JWT token
```

### Template Purchase Flow
```
1. POST /templates/:id/purchase
2. Create Transaction (PENDING)
3. Process payment via Stripe/Razorpay
4. Update Transaction status (SUCCESS)
5. Add to User.purchases[]
6. Update UserWallet.balance
```

### Subscription Renewal Flow
```
1. Cron job checks expired subscriptions
2. If autoRenew = true
3. Create new Transaction
4. Process payment
5. Create new Subscription record
6. Update User.premiumExpiresAt
```

---

## Query Examples

### Get user's templates with ratings
```javascript
User.findById(userId)
    .populate('templates')
    .exec()
```

### Get paid templates in Resume category
```javascript
Template.find({
    category: templateCategory.RESUME,
    isPaid: true,
    isActive: true
})
.sort({ rating: -1 })
```

### Get user's purchase history
```javascript
Transaction.find({ 
    userId, 
    status: paymentStatus.SUCCESS 
})
.populate('templateId')
.sort({ createdAt: -1 })
```

### Get active subscriptions expiring soon
```javascript
Subscription.find({
    status: subscriptionStatus.ACTIVE,
    endDate: { $lt: Date.now() + 7*24*60*60*1000 }
})
```

