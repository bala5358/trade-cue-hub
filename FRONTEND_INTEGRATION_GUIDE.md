# Frontend Integration Guide

## Overview
This guide explains how to integrate the frontend React application with your Azure ASP.NET Core API.

## Configuration

### 1. Set up Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the API URL:
```
VITE_API_BASE_URL=https://your-actual-azure-service.azure.com/api
```

### 2. Project Structure

```
src/
├── types/              # TypeScript interfaces matching Azure API models
│   ├── auth.types.ts
│   ├── signals.types.ts
│   ├── stock-picks.types.ts
│   ├── portfolio.types.ts
│   ├── settings.types.ts
│   ├── admin.types.ts
│   └── api.types.ts
│
├── services/           # API service layer
│   ├── api-client.ts           # Base HTTP client with JWT handling
│   ├── auth.service.ts         # Authentication endpoints
│   ├── signals.service.ts      # Trading signals endpoints
│   ├── stock-picks.service.ts  # Stock picks endpoints
│   ├── portfolio.service.ts    # Portfolio & trades endpoints
│   ├── settings.service.ts     # User settings endpoints
│   ├── admin.service.ts        # Admin endpoints
│   └── index.ts                # Service exports
```

## Usage Examples

### Authentication

```typescript
import { authService } from '@/services';

// Register new user
try {
  const response = await authService.register({
    email: 'user@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890'
  });
  
  if (response.success) {
    console.log('User registered:', response.user);
    // Token is automatically stored
  }
} catch (error) {
  console.error('Registration failed:', error);
}

// Login
try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'SecurePass123!'
  });
  
  if (response.success) {
    console.log('Logged in:', response.user);
    // Token is automatically stored
  }
} catch (error) {
  console.error('Login failed:', error);
}

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

### Trading Signals

```typescript
import { signalsService } from '@/services';

// Get signals with filters
const signals = await signalsService.getSignals({
  status: 'active',
  market: 'US',
  action: 'BUY',
  page: 1,
  pageSize: 20
});

console.log('Signals:', signals.data);
console.log('Total pages:', signals.pagination.totalPages);

// Get dashboard statistics
const stats = await signalsService.getStatistics();
console.log('Active signals:', stats.activeSignals);
console.log('Win rate:', stats.winRate);
```

### Stock Picks

```typescript
import { stockPicksService } from '@/services';

// Get stock picks
const picks = await stockPicksService.getStockPicks({
  recommendation: 'Buy',
  confidence: 'High',
  page: 1
});

console.log('Stock picks:', picks.data);
console.log('Average return:', picks.summary.avgPotentialReturn);
```

### Portfolio & Trades

```typescript
import { portfolioService } from '@/services';

// Get trade history
const trades = await portfolioService.getTrades({
  market: 'USD',
  startDate: '2025-01-01',
  endDate: '2025-10-21',
  page: 1
});

// Get portfolio performance
const performance = await portfolioService.getPerformance();
console.log('Total profit:', performance.totalProfit);
console.log('Win rate:', performance.winRate);

// Get watchlist
const watchlist = await portfolioService.getWatchlist();

// Add to watchlist
await portfolioService.addToWatchlist({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  market: 'NASDAQ'
});

// Remove from watchlist
await portfolioService.removeFromWatchlist('watchlist-id');
```

### User Settings

```typescript
import { settingsService } from '@/services';

// Get user settings
const settings = await settingsService.getSettings();

// Update settings
await settingsService.updateSettings({
  pushNotifications: true,
  emailNotifications: false,
  smsAlerts: true,
  indiaMarketEnabled: true,
  usMarketEnabled: true
});
```

### Admin Functions

```typescript
import { adminService } from '@/services';

// Get all settings
const adminSettings = await adminService.getSettings();

// Update app settings
await adminService.updateAppSettings({
  appName: 'SUPER Pi',
  maintenanceMode: false,
  apiRateLimitingEnabled: true
});

// Get security settings
const security = await adminService.getSecuritySettings();

// Update security settings
await adminService.updateSecuritySettings({
  twoFactorRequired: true,
  sessionTimeoutMinutes: 45
});

// Get all users
const users = await adminService.getUsers({
  role: 'user',
  search: 'john',
  page: 1,
  pageSize: 20
});

// Update user roles
await adminService.updateUserRoles('user-id', {
  roles: ['user', 'admin']
});

// Get audit logs
const logs = await adminService.getAuditLogs({
  action: 'UPDATE_USER_ROLES',
  startDate: '2025-01-01',
  page: 1
});
```

## Error Handling

All services throw errors that can be caught and handled:

```typescript
try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'wrong'
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    // Show toast notification to user
  }
}
```

## Token Management

The `ApiClient` automatically manages JWT tokens:
- Tokens are stored in localStorage
- Automatically included in all authenticated requests
- Cleared on logout

## Updating the Auth Context

Replace `src/lib/auth.ts` with calls to the new services:

```typescript
import { authService } from '@/services';

export const authServiceNew = {
  async login(email: string, password: string) {
    const response = await authService.login({ email, password });
    return response;
  },

  async signup(email: string, password: string, name?: string) {
    const [firstName, lastName] = name?.split(' ') || ['', ''];
    const response = await authService.register({
      email,
      password,
      firstName,
      lastName
    });
    return response;
  },

  async getCurrentUser() {
    const response = await authService.getCurrentUser();
    return response.user || null;
  },

  async logout() {
    await authService.logout();
  },

  async isAdmin() {
    const roles = await authService.getUserRoles();
    return roles.isAdmin;
  }
};
```

## Next Steps

1. **Deploy Azure API**: Follow `AZURE_API_SPEC.md` to implement the backend
2. **Update Environment**: Set `VITE_API_BASE_URL` to your Azure endpoint
3. **Replace Mock Data**: Update components to use services instead of mock data
4. **Test Integration**: Test all endpoints with real data
5. **Add Error Handling**: Implement proper error handling and user feedback

## TypeScript Support

All services are fully typed with TypeScript interfaces that match your Azure API models. Your IDE will provide:
- Auto-completion for all methods and properties
- Type checking for request/response data
- Inline documentation
