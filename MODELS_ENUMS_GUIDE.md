# Models & Enums Documentation

## Directory Structure

```
server/
├── enums/
│   ├── index.js                 (centralized exports)
│   ├── gender.js                (MALE, FEMALE, OTHER)
│   ├── userType.js              (USER, ADMIN, SUB_ADMIN, PREMIUM)
│   ├── status.js                (ACTIVE, INACTIVE, BLOCKED, PENDING, DELETED)
│   ├── authProvider.js          (LOCAL, GOOGLE, FIREBASE)
│   ├── templateCategory.js      (BIODATA, RESUME, COVER_LETTER, WEDDING_CARD, INVITATION)
│   ├── paymentStatus.js         (PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED)
│   ├── paymentMethod.js         (STRIPE, RAZORPAY, PAYPAL, BANK_TRANSFER, UPI)
│   └── subscriptionStatus.js    (ACTIVE, EXPIRED, CANCELLED, PENDING)
│
└── model/
    ├── index.js                 (centralized exports)
    ├── user.js                  (User model with auth)
    ├── template.js              (Template model with ratings)
    ├── transactions.js          (Transaction/Payment model)
    ├── userWallet.js            (User wallet/balance tracking)
    ├── subscription.js          (Subscription/Plans model)
    └── coupon.js                (Coupon/Discount model)
```

---

## Enums

All enums are now **ES6 modules** with centralized exports.

### Import Options

```javascript
// Option 1: Direct import
import templateCategory from '../enums/templateCategory.js';

// Option 2: Centralized import (recommended)
import { templateCategory, paymentStatus, userType } from '../enums/index.js';
```

### Available Enums

1. **gender** - MALE, FEMALE, OTHER
2. **userType** - USER, ADMIN, SUB_ADMIN, PREMIUM
3. **status** - ACTIVE, INACTIVE, BLOCKED, PENDING, DELETED
4. **authProvider** - LOCAL, GOOGLE, FIREBASE
5. **templateCategory** - BIODATA, RESUME, COVER_LETTER, WEDDING_CARD, INVITATION
6. **paymentStatus** - PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED
7. **paymentMethod** - STRIPE, RAZORPAY, PAYPAL, BANK_TRANSFER, UPI
8. **subscriptionStatus** - ACTIVE, EXPIRED, CANCELLED, PENDING

---

## Models

### 1. User Model (`server/model/user.js`)

**Fields:**
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, hashed with bcrypt)
- `phone` (String)
- `profilePicture` (String)
- `dateOfBirth` (Date)
- `gender` (Enum: gender)
- `googleId` (String, unique, sparse)
- `authProvider` (Enum: authProvider, default: LOCAL)
- `deviceToken` (String)
- `status` (Enum: status, default: PENDING)
- `userType` (Enum: userType, default: USER)
- `isPremium` (Boolean, default: false)
- `premiumExpiresAt` (Date)
- `isVerified` (Boolean, default: false)
- `isActive` (Boolean, default: true)
- `lastLoggedIn` (Date)
- `otp` (String)
- `otpExpireTime` (Date)
- `templates` (Array of Template refs)
- `purchases` (Array of Transaction refs)

**Methods:**
- `matchPassword(enteredPassword)` - Compare plain password with hashed

**Indexes:**
- email
- googleId

---

### 2. Template Model (`server/model/template.js`)

**Fields:**
- `title` (String, required)
- `description` (String)
- `category` (Enum: templateCategory, required)
- `thumbnail` (String)
- `content` (Mixed/JSON, required)
- `isPaid` (Boolean, default: false)
- `price` (Number, default: 0)
- `createdBy` (User ref, required)
- `downloads` (Number, default: 0)
- `views` (Number, default: 0)
- `rating` (Number, 0-5, default: 0)
- `ratings` (Array with userId, score, review, createdAt)
- `tags` (Array of Strings)
- `isActive` (Boolean, default: true)
- `isFeatured` (Boolean, default: false)
- `fileUrl` (String)
- `previewUrl` (String)
- `version` (Number, default: 1)

**Indexes:**
- Full-text search (title, description, tags)
- category + isActive
- createdBy
- isFeatured + createdAt
- rating (descending)

---

### 3. Transaction Model (`server/model/transactions.js`)

**Fields:**
- `userId` (User ref, required)
- `templateId` (Template ref)
- `subscriptionId` (Subscription ref)
- `amount` (Number, required)
- `currency` (String, default: USD)
- `status` (Enum: paymentStatus, default: PENDING)
- `paymentMethod` (Enum: paymentMethod)
- `transactionId` (String, unique, sparse)
- `orderId` (String, unique, sparse)
- `paymentGatewayResponse` (Mixed/JSON)
- `description` (String)
- `metadata` (Mixed/JSON)
- `refundAmount` (Number, default: 0)
- `refundReason` (String)
- `refundedAt` (Date)

**Indexes:**
- userId + createdAt (descending)
- status
- transactionId
- templateId

---

### 4. UserWallet Model (`server/model/userWallet.js`)

**Fields:**
- `userId` (User ref, required, unique)
- `balance` (Number, default: 0)
- `currency` (String, default: USD)
- `totalEarned` (Number, default: 0)
- `totalSpent` (Number, default: 0)
- `transactions` (Array of Transaction refs)

**Indexes:**
- userId

---

### 5. Subscription Model (`server/model/subscription.js`)

**Fields:**
- `userId` (User ref, required)
- `planName` (Enum: BASIC, PREMIUM, ENTERPRISE, required)
- `price` (Number, required)
- `currency` (String, default: USD)
- `billingCycle` (Enum: MONTHLY, YEARLY, LIFETIME, default: MONTHLY)
- `status` (Enum: subscriptionStatus, default: PENDING)
- `startDate` (Date, required)
- `endDate` (Date, required)
- `renewalDate` (Date)
- `autoRenew` (Boolean, default: true)
- `transactionId` (Transaction ref)
- `features` (Array of Strings)
- `templateLimit` (Number, default: -1 for unlimited)
- `downloadLimit` (Number, default: -1 for unlimited)
- `aiCredits` (Number, default: 0)
- `metadata` (Mixed/JSON)

**Indexes:**
- userId
- status
- endDate

---

### 6. Coupon Model (`server/model/coupon.js`)

**Fields:**
- `code` (String, required, unique, uppercase)
- `description` (String)
- `discountType` (Enum: PERCENTAGE, FIXED_AMOUNT, required)
- `discountValue` (Number, required)
- `maxDiscount` (Number) - for percentage discounts
- `minPurchaseAmount` (Number, default: 0)
- `maxUsage` (Number, default: -1 for unlimited)
- `currentUsage` (Number, default: 0)
- `usagePerUser` (Number, default: 1)
- `usersUsed` (Array with userId, usageCount)
- `validFrom` (Date, required)
- `validUntil` (Date, required)
- `isActive` (Boolean, default: true)
- `applicableTemplates` (Array of Template refs)
- `applicableCategories` (Array of Strings)

**Indexes:**
- code
- validUntil
- isActive

---

## How to Import Models

```javascript
// Option 1: Centralized imports (recommended)
import { User, Template, Transaction, UserWallet, Subscription, Coupon } from '../model/index.js';

// Option 2: Individual imports
import User from '../model/user.js';
import Template from '../model/template.js';

// Option 3: Enums
import { userType, templateCategory, paymentStatus } from '../enums/index.js';
```

---

## Usage Examples

### Creating a User with Enums

```javascript
import { User } from '../model/index.js';
import { userType, status } from '../enums/index.js';

const newUser = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123',
    userType: userType.PREMIUM,
    status: status.ACTIVE,
});

await newUser.save();
```

### Creating a Template

```javascript
import { Template } from '../model/index.js';
import { templateCategory } from '../enums/index.js';

const template = new Template({
    title: 'Professional Resume',
    category: templateCategory.RESUME,
    content: { /* template structure */ },
    createdBy: userId,
});

await template.save();
```

### Creating a Transaction

```javascript
import { Transaction } from '../model/index.js';
import { paymentStatus, paymentMethod } from '../enums/index.js';

const transaction = new Transaction({
    userId,
    templateId,
    amount: 99.99,
    status: paymentStatus.SUCCESS,
    paymentMethod: paymentMethod.STRIPE,
});

await transaction.save();
```

---

## Notes

✅ All models use ES6 modules  
✅ All enums centralized with easy imports  
✅ Password hashing implemented with bcrypt  
✅ Indexes optimized for common queries  
✅ Validation with Joi in middleware  
✅ Consistent schema patterns across models  
✅ Support for future extensibility with metadata fields  

