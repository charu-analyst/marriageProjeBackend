# Quick Start: Purchase API & HTTP Basic Auth

## 🔐 HTTP Basic Auth Credentials

```
Username: admin
Password: admin123
```

**Where to find it:**
- File: `config/swagger.js` (line ~39-42)
- Security Scheme: `basicAuth` with type `http`

---

## 🛒 Purchase API Endpoints

### Location:
- **Routes**: `server/api/v1/routes/purchaseRoutes.js`
- **Controller**: `server/api/v1/controller/purchaseController.js`
- **Service**: `server/api/v1/services/transactionService.js`
- **Server**: `server/common/server.js` (registered at `/api/v1/purchases`)

### Base URL:
```
http://localhost:8046/api/v1/purchases
```

---

## 📋 All 6 Purchase Endpoints

### 1. POST `/buy/{templateId}` - Purchase Template

**Request:**
```bash
curl -X POST "http://localhost:8046/api/v1/purchases/buy/TEMPLATE_ID" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "CREDIT_CARD",
    "couponCode": "SAVE10"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Template purchased successfully",
  "data": {
    "transaction": { ... },
    "template": { "id": "...", "name": "..." }
  }
}
```

---

### 2. GET `/history` - Purchase History

**Request:**
```bash
curl -X GET "http://localhost:8046/api/v1/purchases/history?page=1&limit=10&status=SUCCESS" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "purchases": [ ... ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### 3. GET `/my-downloads` - Downloaded Templates

**Request:**
```bash
curl -X GET "http://localhost:8046/api/v1/purchases/my-downloads?page=1&limit=10" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "downloads": [ 
      {
        "transactionId": "...",
        "template": { ... },
        "purchasedAt": "2024-01-15T10:30:00Z",
        "downloadCount": 3
      }
    ],
    "total": 5
  }
}
```

---

### 4. POST `/{transactionId}/download` - Generate Download Link

**Request:**
```bash
curl -X POST "http://localhost:8046/api/v1/purchases/TXN123/download" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Download link generated successfully",
  "data": {
    "downloadUrl": "http://localhost:8046/api/v1/purchases/TXN123/file",
    "expiresIn": 3600,
    "template": { "id": "...", "name": "..." }
  }
}
```

---

### 5. GET `/{transactionId}` - Transaction Details

**Request:**
```bash
curl -X GET "http://localhost:8046/api/v1/purchases/TXN123" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "templateId": "...",
    "amount": 299,
    "status": "SUCCESS",
    "paymentMethod": "CREDIT_CARD",
    "transactionId": "TXN-1705318200000-abc123def",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 6. POST `/{transactionId}/refund` - Request Refund

**Request:**
```bash
curl -X POST "http://localhost:8046/api/v1/purchases/TXN123/refund" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Template does not meet my requirements"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "transaction": { ... },
    "refundAmount": 299,
    "refundStatus": "COMPLETED"
  }
}
```

---

## 🧪 Testing in Swagger UI

### Access Swagger:
```
http://localhost:8046/api-docs
```

### Steps:
1. Scroll to **Purchases** section
2. Click any endpoint to expand
3. Click **Try it out** button
4. Fill in parameters and request body
5. Click **Execute**

---

## 📊 Transaction Service Functions

These 14 functions are available in `transactionService.js`:

```javascript
// Basic operations
createTransaction(data)           // Create new transaction
getTransaction(id)                // Get by MongoDB ID
getTransactionByCustomId(txnId)   // Get by TXN-xxx ID
updateTransactionStatus(id, status)

// User operations
getUserTransactions(userId, page, limit, status)
hasUserPurchasedTemplate(userId, templateId)
getUserTotalSpending(userId)

// Analytics
getTemplateTransactionStats(templateId)
getRevenueReport(startDate, endDate)
getTopSellingTemplates(limit)

// Admin
processRefund(transactionId, reason)
deleteTransaction(transactionId)
```

---

## 🔗 Integration Checklist

- ✅ Purchase routes created and registered in server
- ✅ Purchase controller with 6 main functions
- ✅ Transaction service with 14 database functions
- ✅ HTTP Basic Auth added to Swagger config
- ✅ Purchases tag added to Swagger
- ✅ Purchase routes added to Swagger apis array
- ✅ All endpoints documented with JSDoc comments

---

## ⚙️ Configuration Files

### `config/swagger.js`
- Lines 39-42: HTTP Basic Auth scheme definition
- Lines 278-280: Purchases tag definition
- Lines 286-289: Purchase routes in apis array

### `server/common/server.js`
- Line 7: Import purchaseRoutes
- Line 26: Register at `/api/v1/purchases`

---

## 🔑 Key Features Implemented

### Purchase Flow:
1. ✅ Verify template exists
2. ✅ Check not already purchased
3. ✅ Create transaction record
4. ✅ Process payment (placeholder)
5. ✅ Update transaction status
6. ✅ Add to user purchases
7. ✅ Increment template downloads

### Refund Flow:
1. ✅ Verify transaction ownership
2. ✅ Check 7-day refund window
3. ✅ Process refund
4. ✅ Remove from purchases
5. ✅ Update wallet (placeholder)

### Security:
- ✅ JWT Bearer token required
- ✅ User ownership verification
- ✅ Status validation
- ✅ Refund window enforcement

---

## 📝 Example: Complete Purchase Workflow

```bash
# 1. Get JWT token
TOKEN=$(curl -X POST "http://localhost:8046/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }' | jq -r '.data.token')

# 2. Purchase a template
TXID=$(curl -X POST "http://localhost:8046/api/v1/purchases/buy/TEMPLATE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "CREDIT_CARD"
  }' | jq -r '.data.transaction._id')

# 3. Get purchase details
curl -X GET "http://localhost:8046/api/v1/purchases/$TXID" \
  -H "Authorization: Bearer $TOKEN"

# 4. Download template
curl -X POST "http://localhost:8046/api/v1/purchases/$TXID/download" \
  -H "Authorization: Bearer $TOKEN"

# 5. Get purchase history
curl -X GET "http://localhost:8046/api/v1/purchases/history" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🆘 Troubleshooting

### Issue: Endpoints return 401 Unauthorized
**Solution:** Add valid JWT Bearer token from `/auth/login` in Authorization header

### Issue: Cannot find transaction
**Solution:** Ensure transaction ID format is correct:
- MongoDB ID: `507f1f77bcf86cd799439011`
- Custom ID: `TXN-1705318200000-abc123def`

### Issue: Refund fails with "window expired"
**Solution:** Refunds only allowed within 7 days of purchase. Check `createdAt` date.

### Issue: 404 on purchase routes
**Solution:** Ensure you restarted the server after adding purchase routes

---

## 📚 Additional Resources

- **API Documentation**: http://localhost:8046/api-docs
- **Implementation Details**: `PURCHASE_API_IMPLEMENTATION.md`
- **Transaction Model**: `server/model/transactions.js`
- **User Model**: `server/model/user.js`

---

**Last Updated:** Just Now ✅
**Status:** Ready for Testing
