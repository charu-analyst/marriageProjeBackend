# Services Quick Reference

## Import Services

```javascript
// Single service
import * as authService from '../services/authService.js';
import * as templateService from '../services/templateService.js';

// Multiple services
import * as authService from '../services/authService.js';
import * as templateService from '../services/templateService.js';

// From index
import { authService, templateService } from '../services/index.js';
```

---

## Auth Service - Common Operations

### Signup Flow
```javascript
// 1. Check if email exists
const existingUser = await authService.findUserByEmail(email);
if (existingUser) {
    // Email already registered
}

// 2. Create user
const user = await authService.createUser({
    name,
    email,
    password, // Will be hashed automatically
    userType: userType.USER,
    status: status.ACTIVE,
    authProvider: authProvider.LOCAL,
});

// 3. Generate token
const token = authService.generateAuthToken(user._id, user.userType);
```

### Login Flow
```javascript
// 1. Find user with password
const user = await authService.findUserByEmailWithPassword(email);

// 2. Verify password
const isValid = await authService.verifyPassword(user, password);
if (!isValid) {
    // Invalid password
}

// 3. Update last login
await authService.updateLastLoggedIn(user._id);

// 4. Generate token
const token = authService.generateAuthToken(user._id, user.userType);
```

### Update User
```javascript
// Simple update
const user = await authService.updateUserById(userId, {
    name: 'New Name',
    phone: '1234567890',
});

// Update premium status
const user = await authService.updatePremiumStatus(
    userId,
    true, // isPremium
    new Date('2026-12-31') // expiresAt
);

// Add/remove templates
await authService.updateUserTemplates(userId, templateId, 'push');
await authService.updateUserTemplates(userId, templateId, 'pull');

// Add/remove purchases
await authService.updateUserPurchases(userId, transactionId, 'push');
await authService.updateUserPurchases(userId, transactionId, 'pull');
```

### Admin Operations
```javascript
// Get all users with search
const { users, pagination } = await authService.getAllUsers({
    page: 1,
    limit: 10,
    search: 'john',
});

// Delete user
await authService.deleteUserById(userId);
```

---

## Template Service - Common Operations

### Browse Templates
```javascript
// Get all templates with filters
const { templates, pagination } = await templateService.getAllTemplates({
    category: 'RESUME',
    search: 'professional',
    page: 1,
    limit: 10,
    sort: '-createdAt', // or 'rating', 'downloads'
});

// Get featured templates
const featured = await templateService.getFeaturedTemplates(6);

// Get top rated templates
const topRated = await templateService.getTopRatedTemplates(6);

// Get by category
const resumes = await templateService.getTemplatesByCategory('RESUME', 10);

// Search templates
const results = await templateService.searchTemplates('professional', 20);
```

### View Template
```javascript
// Get template with creator & ratings
const template = await templateService.getTemplateById(templateId);

// Increment views
await templateService.incrementTemplateViews(templateId);

// Increment downloads
await templateService.incrementTemplateDownloads(templateId);
```

### Create Template
```javascript
const template = await templateService.createTemplate({
    title: 'Modern Resume',
    description: 'Professional resume template',
    category: templateCategory.RESUME,
    content: { /* JSON structure */ },
    isPaid: false,
    price: 0,
    tags: ['professional', 'modern'],
    createdBy: userId,
});
```

### Edit Template
```javascript
const template = await templateService.updateTemplateById(
    templateId,
    {
        title: 'Updated Title',
        description: 'Updated description',
        isPaid: true,
        price: 9.99,
    }
);
```

### Delete Template
```javascript
await templateService.deleteTemplateById(templateId);
```

### Rating System
```javascript
// Add or update rating
const template = await templateService.addTemplateRating(
    templateId,
    userId,
    5, // score (1-5)
    'Excellent template!' // review
);

// Remove rating
const template = await templateService.removeTemplateRating(
    templateId,
    userId
);
```

### User's Templates
```javascript
const userTemplates = await templateService.getUserTemplates(userId);
```

### Admin Operations
```javascript
// Get all templates (including inactive)
const { templates, pagination } = await templateService.getAllTemplatesAdmin({
    page: 1,
    limit: 10,
    search: 'resume',
    category: 'RESUME',
});

// Toggle featured
const template = await templateService.toggleFeaturedStatus(templateId);

// Bulk update status
await templateService.bulkUpdateTemplateStatus(
    [id1, id2, id3],
    true // set to active
);
```

### Utility
```javascript
// Check if user is creator
const isCreator = await templateService.isTemplateCreator(
    templateId,
    userId
);
```

---

## Controller Examples

### Complete Signup Controller
```javascript
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.validatedData;

    // Service call 1: Check email
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Service call 2: Create user
    const user = await authService.createUser({
      name,
      email,
      password,
      userType: userType.USER,
      status: status.ACTIVE,
      authProvider: authProvider.LOCAL,
    });

    // Service call 3: Generate token
    const token = authService.generateAuthToken(user._id, user.userType);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during signup',
      error: error.message,
    });
  }
};
```

### Complete Create Template Controller
```javascript
export const createTemplate = async (req, res) => {
  try {
    const { title, description, category, content, isPaid, price, tags } = req.validatedData;

    // Service call 1: Create template
    const template = await templateService.createTemplate({
      title,
      description,
      category,
      content,
      isPaid,
      price,
      tags,
      createdBy: req.user.id,
    });

    // Service call 2: Update user's templates
    await authService.updateUserTemplates(req.user.id, template._id, 'push');

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating template',
      error: error.message,
    });
  }
};
```

### Complete Rate Template Controller
```javascript
export const rateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { score, review } = req.body;

    // Validate score
    if (score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Service call: Add rating
    const template = await templateService.addTemplateRating(
      templateId,
      req.user.id,
      score,
      review
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message,
    });
  }
};
```

---

## Error Handling Pattern

```javascript
export const someController = async (req, res) => {
  try {
    // Call services
    const result = await someService.someMethod();

    // Validate result
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Return success
    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    // Catch any errors from services
    res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message,
    });
  }
};
```

---

## Response Format

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { /* Result data */ },
    "pagination": { /* Optional pagination */ }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "error": "Detailed error"
}
```

---

## Files Created

✅ `/server/api/v1/services/authService.js` - 18 functions  
✅ `/server/api/v1/services/templateService.js` - 24 functions  
✅ `/server/api/v1/services/index.js` - Centralized exports  
✅ Updated `/server/api/v1/controller/authController.js` - Uses authService  
✅ Updated `/server/api/v1/controller/templateController.js` - Uses templateService  
✅ Updated `/server/api/v1/routes/templateRoutes.js` - New endpoints  

---

## Total Functions

- **Auth Service**: 18 functions
- **Template Service**: 24 functions
- **Total**: 42 service functions

---

## Next: Create Transaction Service

When ready, create additional services:

```javascript
// server/api/v1/services/transactionService.js
export const createTransaction = async (transactionData) => {
    // Implementation
};

export const getTransactionById = async (id) => {
    // Implementation
};

// ... more functions
```

