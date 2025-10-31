# Azure ASP.NET Core API Specification for SUPER Pi

## Overview
This document provides complete API specifications for the SUPER Pi trading platform backend to be implemented in Azure using ASP.NET Core.

## Base Configuration

- **Base URL**: `https://your-service.azure.com/api`
- **API Version**: v1
- **Authentication**: JWT Bearer tokens (Azure AD B2C)
- **Content-Type**: `application/json`

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "roles": ["user", "admin"],
  "exp": 1234567890
}
```

### Authorization Headers
```
Authorization: Bearer {jwt_token}
```

---

## Controllers & Endpoints

## 1. Authentication Controller

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- 400: Invalid email or weak password
- 409: Email already exists

---

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["user"]
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- 401: Invalid credentials
- 403: Account not verified

---

### POST /api/auth/logout
Invalidate user session (optional - JWT is stateless).

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/me
Get current authenticated user profile.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "roles": ["user"],
  "createdAt": "2025-10-21T10:00:00Z"
}
```

---

### POST /api/auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

## 2. User Profile Controller

### GET /api/users/profile
Get user profile details.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "createdAt": "2025-10-21T10:00:00Z",
  "updatedAt": "2025-10-21T10:00:00Z"
}
```

---

### PUT /api/users/profile
Update user profile information.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "profile": { /* updated profile object */ }
}
```

---

### GET /api/users/roles
Check if current user has admin role.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "roles": ["user", "admin"],
  "isAdmin": true
}
```

---

## 3. Trading Signals Controller

### GET /api/signals
Get list of trading signals with filters.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `status` (optional): active | completed | stopped
- `market` (optional): India | US
- `action` (optional): BUY | SELL
- `page` (default: 1): Page number
- `pageSize` (default: 20): Items per page

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "stock": "AAPL",
      "action": "BUY",
      "price": 178.50,
      "target": 185.00,
      "stopLoss": 175.00,
      "market": "US",
      "status": "active",
      "profit": null,
      "createdAt": "2025-10-21T10:00:00Z",
      "completedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

---

### GET /api/signals/statistics
Get dashboard statistics for signals.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "activeSignals": 12,
  "todayProfit": 8450.00,
  "winRate": 78.5,
  "avgResponseTime": 2.3,
  "totalTrades": 45
}
```

---

## 4. Stock Picks Controller

### GET /api/stock-picks
Get expert stock recommendations.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `recommendation` (optional): Buy | Sell | Hold
- `confidence` (optional): High | Medium | Low
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "market": "NASDAQ",
      "recommendation": "Buy",
      "targetPrice": 195.50,
      "currentPrice": 178.25,
      "potentialReturn": 9.7,
      "confidence": "High",
      "reasoning": "Strong product lineup and services growth...",
      "createdAt": "2025-10-18T10:00:00Z",
      "updatedAt": "2025-10-18T10:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ },
  "summary": {
    "totalPicks": 3,
    "avgPotentialReturn": 5.7,
    "highConfidenceCount": 2
  }
}
```

---

## 5. Portfolio Controller

### GET /api/portfolio/trades
Get user's trade history.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `market` (optional): INR | USD
- `startDate` (optional): ISO date
- `endDate` (optional): ISO date
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "stock": "AAPL",
      "market": "USD",
      "action": "BUY",
      "entryPrice": 178.50,
      "exitPrice": 185.00,
      "quantity": 5.60,
      "profit": 36.40,
      "profitPercentage": 3.64,
      "createdAt": "2025-10-19T14:30:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### GET /api/portfolio/performance
Get portfolio performance metrics.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "currentValue": 1036.40,
  "totalProfit": 36.40,
  "totalProfitPercentage": 3.64,
  "winRate": 75.5,
  "winningTrades": 15,
  "losingTrades": 5,
  "totalTrades": 20,
  "initialInvestment": {
    "INR": 1000.00,
    "USD": 1000.00
  }
}
```

---

### GET /api/portfolio/watchlist
Get user's watchlist of stocks.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "market": "NASDAQ",
      "createdAt": "2025-10-20T10:00:00Z"
    }
  ]
}
```

---

### POST /api/portfolio/watchlist
Add stock to watchlist.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "market": "NASDAQ"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "watchlistItem": { /* created watchlist item */ }
}
```

**Errors:**
- 409: Stock already in watchlist

---

### DELETE /api/portfolio/watchlist/{id}
Remove stock from watchlist.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stock removed from watchlist"
}
```

---

## 6. User Settings Controller

### GET /api/settings
Get user settings and preferences.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "pushNotifications": true,
  "emailNotifications": true,
  "smsAlerts": false,
  "weekendNotifications": true,
  "indiaMarketEnabled": true,
  "usMarketEnabled": true,
  "updatedAt": "2025-10-21T10:00:00Z"
}
```

---

### PUT /api/settings
Update user settings.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "pushNotifications": true,
  "emailNotifications": false,
  "smsAlerts": true,
  "weekendNotifications": true,
  "indiaMarketEnabled": true,
  "usMarketEnabled": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "settings": { /* updated settings object */ }
}
```

---

## 7. Admin Settings Controller

**Role Required:** admin

### GET /api/admin/settings
Get all application settings.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "appSettings": {
    "id": "uuid",
    "appName": "SUPER Pi",
    "appDescription": "Advanced analytics platform",
    "maintenanceMode": false,
    "apiRateLimitingEnabled": true,
    "updatedAt": "2025-10-21T10:00:00Z"
  },
  "emailConfig": {
    "smtpHost": "smtp.example.com",
    "smtpPort": 587,
    "fromEmail": "noreply@example.com",
    "emailNotificationsEnabled": true
  },
  "apiConfig": {
    "azureEndpoint": "https://service.azure.com",
    "apiVersion": "v1",
    "rateLimitRequests": 100,
    "rateLimitWindowMinutes": 1
  },
  "notificationConfig": {
    "emailEnabled": true,
    "slackEnabled": false
  }
}
```

---

### PUT /api/admin/settings/app
Update application settings.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "appName": "SUPER Pi",
  "appDescription": "Updated description",
  "maintenanceMode": false,
  "apiRateLimitingEnabled": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "settings": { /* updated app settings */ }
}
```

---

### PUT /api/admin/settings/email
Update email configuration.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "smtpHost": "smtp.example.com",
  "smtpPort": 587,
  "smtpUsername": "user@example.com",
  "smtpPassword": "encrypted_password",
  "fromEmail": "noreply@example.com",
  "emailNotificationsEnabled": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email configuration updated"
}
```

---

## 8. Admin Security Controller

**Role Required:** admin

### GET /api/admin/security
Get security settings.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "twoFactorRequired": false,
  "emailVerificationRequired": true,
  "strongPasswordRequired": true,
  "sessionTimeoutMinutes": 30,
  "rememberMeEnabled": true,
  "rbacEnabled": true,
  "ipWhitelistEnabled": false
}
```

---

### PUT /api/admin/security
Update security settings.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "twoFactorRequired": true,
  "emailVerificationRequired": true,
  "strongPasswordRequired": true,
  "sessionTimeoutMinutes": 45,
  "rememberMeEnabled": true,
  "rbacEnabled": true,
  "ipWhitelistEnabled": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "settings": { /* updated security settings */ }
}
```

---

### GET /api/admin/security/ip-whitelist
Get IP whitelist entries.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "ipAddress": "192.168.1.1",
      "description": "Office IP",
      "createdBy": "uuid",
      "createdAt": "2025-10-21T10:00:00Z"
    }
  ]
}
```

---

### POST /api/admin/security/ip-whitelist
Add IP to whitelist.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "ipAddress": "192.168.1.1",
  "description": "Office IP"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "entry": { /* created IP whitelist entry */ }
}
```

---

### DELETE /api/admin/security/ip-whitelist/{id}
Remove IP from whitelist.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "IP removed from whitelist"
}
```

---

## 9. Admin Users Controller

**Role Required:** admin

### GET /api/admin/users
Get all users with filtering and pagination.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `role` (optional): admin | user
- `search` (optional): Search by email/name
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "roles": ["user"],
      "createdAt": "2025-10-21T10:00:00Z",
      "lastSignInAt": "2025-10-21T15:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### PUT /api/admin/users/{userId}/roles
Update user roles.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "roles": ["user", "admin"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User roles updated"
}
```

---

### GET /api/admin/audit-logs
Get audit logs of admin actions.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `userId` (optional): Filter by admin user
- `action` (optional): Filter by action type
- `startDate` (optional)
- `endDate` (optional)
- `page` (default: 1)
- `pageSize` (default: 50)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "adminUserId": "uuid",
      "action": "UPDATE_USER_ROLES",
      "entityType": "user_roles",
      "entityId": "uuid",
      "changes": {
        "before": ["user"],
        "after": ["user", "admin"]
      },
      "ipAddress": "192.168.1.1",
      "createdAt": "2025-10-21T10:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

## C# DTOs/Models Structure

### Authentication DTOs
```csharp
public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [MinLength(8)]
    public string Password { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; }
    
    [Phone]
    public string Phone { get; set; }
}

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string Password { get; set; }
}

public class AuthResponse
{
    public bool Success { get; set; }
    public UserDto User { get; set; }
    public string Token { get; set; }
}
```

### Entity Models
```csharp
public class Signal
{
    public Guid Id { get; set; }
    public string Stock { get; set; }
    public string Action { get; set; } // "BUY" or "SELL"
    public decimal Price { get; set; }
    public decimal Target { get; set; }
    public decimal StopLoss { get; set; }
    public string Market { get; set; } // "India" or "US"
    public string Status { get; set; } // "active", "completed", "stopped"
    public decimal? Profit { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class StockPick
{
    public Guid Id { get; set; }
    public string Symbol { get; set; }
    public string Name { get; set; }
    public string Market { get; set; }
    public string Recommendation { get; set; } // "Buy", "Sell", "Hold"
    public decimal TargetPrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal PotentialReturn { get; set; }
    public string Confidence { get; set; } // "High", "Medium", "Low"
    public string Reasoning { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class Trade
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Stock { get; set; }
    public string Market { get; set; }
    public string Action { get; set; }
    public decimal EntryPrice { get; set; }
    public decimal ExitPrice { get; set; }
    public decimal Quantity { get; set; }
    public decimal Profit { get; set; }
    public decimal ProfitPercentage { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific validation error"
    }
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: 401 - Invalid or missing authentication
- `FORBIDDEN`: 403 - Insufficient permissions
- `NOT_FOUND`: 404 - Resource not found
- `VALIDATION_ERROR`: 400 - Invalid input data
- `CONFLICT`: 409 - Resource already exists
- `INTERNAL_ERROR`: 500 - Server error

---

## Rate Limiting

- Default: 100 requests per minute per user
- Admin endpoints: 200 requests per minute
- Rate limit headers included in responses:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1634567890
  ```

---

## Security Best Practices

1. **Password Requirements:**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. **JWT Token:**
   - Expiry: 24 hours
   - Refresh token support recommended
   - Store securely, never in localStorage for production

3. **Input Validation:**
   - All inputs must be validated server-side
   - Use parameterized queries to prevent SQL injection
   - Sanitize all user inputs

4. **CORS Configuration:**
   - Configure allowed origins
   - Restrict to production domains only

5. **Audit Logging:**
   - Log all admin actions
   - Include IP address and timestamp
   - Store change history for sensitive operations
