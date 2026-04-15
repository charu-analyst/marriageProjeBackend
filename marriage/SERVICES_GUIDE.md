# Services Documentation

## Overview

Services contain all database queries and business logic, providing a clean separation between controllers and the database layer. This follows the Service Layer pattern for better code organization and reusability.

## Services Structure

```
server/api/v1/services/
├── index.js              - Centralized service exports
├── authService.js        - User and authentication operations
└── templateService.js    - Template and rating operations
```

---

## Auth Service (`authService.js`)

Handles all user-related database operations.

### User Query Functions

#### `findUserByEmail(email)`
Find user by email address.
```javascript
const user = await authService.findUserByEmail('user@example.com');
```

#### `findUserById(id)`
Find user by MongoDB ID.
```javascript
const user = await authService.findUserById(userId);
```

#### `findUserByEmailWithPassword(email)`
Find user by email with password field selected (for authentication).
```javascript
const user = await authService.findUserByEmailWithPassword('user@example.com');
```

#### `findUserByGoogleId(googleId)`
Find user by Google OAuth ID.
```javascript
const user = await authService.findUserByGoogleId(googleId);
```

### User Create/Update Functions

#### `createUser(userData)`
Create a new user account.
```javascript
const user = await authService.createUser({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    userType: userType.USER,
    status: status.ACTIVE,
    authProvider: authProvider.LOCAL,
});
```

#### `updateUserById(id, updateData)`
Update user data by ID.
```javascript
const user = await authService.updateUserById(userId, {
    name: 'Updated Name',
    phone: '+1234567890',
});
```

#### `updateUserTemplates(userId, templateId, operation)`
Add or remove template from user's templates array.
```javascript
// Add template
await authService.updateUserTemplates(userId, templateId, 'push');

// Remove template
await authService.updateUserTemplates(userId, templateId, 'pull');
```

#### `updateUserPurchases(userId, transactionId, operation)`
Add or remove transaction from user's purchases array.
```javascript
// Add purchase
await authService.updateUserPurchases(userId, transactionId, 'push');

// Remove purchase
await authService.updateUserPurchases(userId, transactionId, 'pull');
```

#### `updatePremiumStatus(userId, isPremium, expiresAt)`
Update user's premium subscription status.
```javascript
const user = await authService.updatePremiumStatus(
    userId, 
    true, 
    new Date('2026-04-07')
);
```

#### `updateLastLoggedIn(userId)`
Update user's last login timestamp.
```javascript
await authService.updateLastLoggedIn(userId);
```

### Authentication Functions

#### `verifyPassword(user, password)`
Verify password for a user (uses bcrypt).
```javascript
const isValid = await authService.verifyPassword(user, 'enteredPassword');
```

#### `generateAuthToken(userId, role)`
Generate JWT token for authenticated user.
```javascript
const token = authService.generateAuthToken(userId, userType.USER);
```

### Admin Functions

#### `getAllUsers(options)`
Get all users with pagination and search (admin only).
```javascript
const result = await authService.getAllUsers({
    page: 1,
    limit: 10,
    search: 'john',
});
// Returns: { users: [...], pagination: {...} }
```

#### `deleteUserById(id)`
Delete user by ID (admin only).
```javascript
const deletedUser = await authService.deleteUserById(userId);
```

---

## Template Service (`templateService.js`)

Handles all template-related database operations.

### Template Query Functions

#### `getAllTemplates(options)`
Get all templates with filtering, search, and pagination.
```javascript
const result = await templateService.getAllTemplates({
    category: 'RESUME',
    search: 'professional',
    page: 1,
    limit: 10,
    sort: '-createdAt',
});
// Returns: { templates: [...], pagination: {...} }
```

#### `getTemplateById(id)`
Get template by ID with populated creator and ratings.
```javascript
const template = await templateService.getTemplateById(templateId);
```

#### `getTemplateByIdLean(id)`
Get template by ID without population (faster, for internal use).
```javascript
const template = await templateService.getTemplateByIdLean(templateId);
```

#### `getUserTemplates(userId)`
Get all templates created by a specific user.
```javascript
const templates = await templateService.getUserTemplates(userId);
```

#### `getFeaturedTemplates(limit)`
Get featured templates.
```javascript
const templates = await templateService.getFeaturedTemplates(6);
```

#### `getTopRatedTemplates(limit)`
Get templates sorted by highest rating.
```javascript
const templates = await templateService.getTopRatedTemplates(6);
```

#### `getTemplatesByCategory(category, limit)`
Get templates by specific category.
```javascript
const templates = await templateService.getTemplatesByCategory('RESUME', 10);
```

#### `searchTemplates(searchTerm, limit)`
Search templates using full-text search.
```javascript
const templates = await templateService.searchTemplates('professional', 20);
```

### Template Create/Update Functions

#### `createTemplate(templateData)`
Create a new template.
```javascript
const template = await templateService.createTemplate({
    title: 'Modern Resume',
    description: 'Professional modern resume',
    category: templateCategory.RESUME,
    content: { /* JSON structure */ },
    isPaid: false,
    price: 0,
    tags: ['professional'],
    createdBy: userId,
});
```

#### `updateTemplateById(id, updateData)`
Update template data.
```javascript
const template = await templateService.updateTemplateById(templateId, {
    title: 'Updated Title',
    isPaid: true,
    price: 9.99,
});
```

#### `deleteTemplateById(id)`
Delete template by ID.
```javascript
await templateService.deleteTemplateById(templateId);
```

### Template Interaction Functions

#### `incrementTemplateViews(id)`
Increment views count for a template.
```javascript
await templateService.incrementTemplateViews(templateId);
```

#### `incrementTemplateDownloads(id)`
Increment downloads count for a template.
```javascript
await templateService.incrementTemplateDownloads(templateId);
```

#### `addTemplateRating(templateId, userId, score, review)`
Add or update a rating for a template.
```javascript
const template = await templateService.addTemplateRating(
    templateId,
    userId,
    5,
    'Excellent template!'
);
// Returns updated template with recalculated average rating
```

#### `removeTemplateRating(templateId, userId)`
Remove a user's rating from a template.
```javascript
const template = await templateService.removeTemplateRating(templateId, userId);
```

### Admin Functions

#### `getAllTemplatesAdmin(options)`
Get all templates (including inactive) for admin.
```javascript
const result = await templateService.getAllTemplatesAdmin({
    page: 1,
    limit: 10,
    search: 'resume',
    category: 'RESUME',
});
```

#### `toggleFeaturedStatus(templateId)`
Toggle featured status of a template.
```javascript
const template = await templateService.toggleFeaturedStatus(templateId);
```

#### `bulkUpdateTemplateStatus(templateIds, isActive)`
Update active status for multiple templates.
```javascript
await templateService.bulkUpdateTemplateStatus(
    [templateId1, templateId2],
    true // Set to active
);
```

### Utility Functions

#### `isTemplateCreator(templateId, userId)`
Check if user is the creator of a template.
```javascript
const isCreator = await templateService.isTemplateCreator(templateId, userId);
```

---

## Usage in Controllers

### Auth Controller Example
```javascript
import * as authService from '../services/authService.js';

export const signup = async (req, res) => {
    try {
        // Check if user exists
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        const user = await authService.createUser(userData);

        // Generate token
        const token = authService.generateAuthToken(user._id, user.userType);

        res.status(201).json({
            success: true,
            data: user,
            token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

### Template Controller Example
```javascript
import * as templateService from '../services/templateService.js';
import * as authService from '../services/authService.js';

export const createTemplate = async (req, res) => {
    try {
        // Create template
        const template = await templateService.createTemplate({
            ...req.validatedData,
            createdBy: req.user.id,
        });

        // Add to user's templates
        await authService.updateUserTemplates(req.user.id, template._id, 'push');

        res.status(201).json({
            success: true,
            data: template,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

---

## Centralized Import

```javascript
import * as authService from '../services/authService.js';
import * as templateService from '../services/templateService.js';

// Or using index.js
import { authService, templateService } from '../services/index.js';
```

---

## Benefits of Service Layer

✅ **Separation of Concerns** - Database logic separated from HTTP logic  
✅ **Reusability** - Same service methods can be used by multiple controllers  
✅ **Testability** - Easier to unit test services independently  
✅ **Maintainability** - Changes to queries only need updates in one place  
✅ **Scalability** - Easy to add new services or extend existing ones  
✅ **Documentation** - Clear interface of available operations  

---

## Adding New Services

When adding a new model (e.g., Transaction), create a new service file:

```javascript
// server/api/v1/services/transactionService.js
import Transaction from '../../../model/transactions.js';

export const createTransaction = async (transactionData) => {
    const transaction = new Transaction(transactionData);
    await transaction.save();
    return transaction;
};

export const getTransactionById = async (id) => {
    return await Transaction.findById(id);
};

// ... more methods
```

Then add to `services/index.js`:
```javascript
export * as transactionService from './transactionService.js';
```

---

## Notes

- All service functions are async and return Promises
- Error handling should be done in controllers
- Services should be stateless (no state storage)
- Use lean() for read-only queries when population isn't needed
- Always use proper MongoDB operations (findByIdAndUpdate instead of find + save for updates)

