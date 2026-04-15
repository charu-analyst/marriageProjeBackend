# Enums Quick Reference

All enums are **ES6 modules** with **centralized exports** in `server/enums/index.js`

---

## Quick Import

```javascript
import { 
    gender, 
    userType, 
    status, 
    authProvider,
    templateCategory,
    paymentStatus,
    paymentMethod,
    subscriptionStatus
} from '../enums/index.js';
```

---

## Enum Values

### Gender
```javascript
gender = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER'
}
```

### User Type
```javascript
userType = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SUB_ADMIN: 'SUB_ADMIN',
    PREMIUM: 'PREMIUM'
}
```

### Status (General)
```javascript
status = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    BLOCKED: 'BLOCKED',
    PENDING: 'PENDING',
    DELETED: 'DELETED'
}
```

### Auth Provider
```javascript
authProvider = {
    LOCAL: 'LOCAL',
    GOOGLE: 'GOOGLE',
    FIREBASE: 'FIREBASE'
}
```

### Template Category
```javascript
templateCategory = {
    BIODATA: 'BIODATA',
    RESUME: 'RESUME',
    COVER_LETTER: 'COVER_LETTER',
    WEDDING_CARD: 'WEDDING_CARD',
    INVITATION: 'INVITATION'
}
```

### Payment Status
```javascript
paymentStatus = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED'
}
```

### Payment Method
```javascript
paymentMethod = {
    STRIPE: 'STRIPE',
    RAZORPAY: 'RAZORPAY',
    PAYPAL: 'PAYPAL',
    BANK_TRANSFER: 'BANK_TRANSFER',
    UPI: 'UPI'
}
```

### Subscription Status
```javascript
subscriptionStatus = {
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
    PENDING: 'PENDING'
}
```

---

## Usage Examples

### In User Model
```javascript
const user = new User({
    userType: userType.PREMIUM,
    status: status.ACTIVE,
    gender: gender.MALE,
    authProvider: authProvider.GOOGLE
});
```

### In Template Model
```javascript
const template = new Template({
    category: templateCategory.RESUME,
    // ...
});
```

### In Transaction Model
```javascript
const transaction = new Transaction({
    status: paymentStatus.SUCCESS,
    paymentMethod: paymentMethod.STRIPE,
    // ...
});
```

### In Subscription Model
```javascript
const subscription = new Subscription({
    status: subscriptionStatus.ACTIVE,
    // ...
});
```

---

## In Validation Schemas

```javascript
import { templateCategory } from '../enums/index.js';

const templateSchema = Joi.object({
    category: Joi.string().valid(
        templateCategory.BIODATA,
        templateCategory.RESUME,
        templateCategory.COVER_LETTER,
        templateCategory.WEDDING_CARD,
        templateCategory.INVITATION
    ).required()
});
```

---

## Benefits

✅ **Centralized** - Single source of truth for all enum values  
✅ **Type-safe** - No magic strings, easy to refactor  
✅ **Immutable** - Using `Object.freeze()`  
✅ **ES6** - Modern JavaScript modules  
✅ **DRY** - Don't Repeat Yourself  
✅ **Maintainable** - Easy to add/remove enum values  

