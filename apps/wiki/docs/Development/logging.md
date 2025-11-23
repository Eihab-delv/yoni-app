---
sidebar_position: 8
---

# Logging

The ts-monorepo uses structured logging with [RFC 5424 severity levels](https://tools.ietf.org/html/rfc5424#section-6.2.1) across all environments. Logs automatically flow to Google Cloud Logging.

## Quick Start

### Mobile

```typescript
import { log } from '@/utils/clientLogger';

log.info('User logged in', { userId: user.id, method: 'email' });
log.error('API request failed', { endpoint: '/api/users', status: 500 });
```

### Web

```typescript
import { logger } from '~/lib/logger';

logger.info('API call successful', { endpoint: '/api/users', duration: 120 });
logger.error('Validation failed', { field: 'email', value: 'invalid@' });
```

### API/Services

```typescript
import { glog } from '@repo/core';

glog.info('User authenticated', { userId: 'user123', method: 'oauth' });
glog.error('Payment processing failed', { orderId: '12345', error: 'CARD_DECLINED' });

// Child logger with context
const userLogger = glog.child({ userId: 'user123', sessionId: 'sess456' });
userLogger.info('Profile updated', { fields: ['email', 'preferences'] });
```

## Log Levels

| Level | Severity | Use Case |
|-------|----------|----------|
| `debug` | 7 | Development information (API payloads, SQL queries) |
| `info` | 6 | Normal operations (user actions, successful API calls) |
| `notice` | 5 | Significant events (system startup, configuration changes) |
| `warning` | 4 | Potential issues (deprecated features, slow responses) |
| `error` | 3 | Error conditions (failed API calls, caught exceptions) |
| `crit` | 2 | Critical conditions (service unavailable, unexpected exceptions) |
| `alert` | 1 | Immediate action required (database down, system component failure) |
| `emerg` | 0 | System unusable (complete failure, data corruption) |

## Environment Behavior

- Automatic transport to Google Cloud Logging
- **Mobile**: Sequential queue ensures ordered delivery
- **Web**: Universal interface works on client and server
- **API**: Includes automatic request parameter logging middleware

:::tip[Logging behaviour for Debug Build Configs]

For expo/react-native **debug builds**, the custom logs will be shown in the **console ONLY** - no transport to Google Cloud.

:::

## Best Practices

```typescript
// ✅ Good: Include relevant context
glog.error('Payment processing failed', { 
  orderId: order.id, 
  amount: order.total, 
  gateway: 'stripe',
  error: error.message 
});

// ❌ Bad: Vague message
glog.error('Something went wrong');

// ✅ Good: Use child loggers for context
const requestLogger = glog.child({ requestId: req.id, userId: req.user.id });
requestLogger.info('Processing request');
requestLogger.error('Validation failed', { field: 'email' });

// ⚠️ Never log sensitive data
// Passwords, tokens, credit card numbers, etc.
```

## Related Documentation

- [RFC 5424 Syslog Protocol](https://tools.ietf.org/html/rfc5424#section-6.2.1)
- [Google Cloud Logging](https://cloud.google.com/logging/docs)
