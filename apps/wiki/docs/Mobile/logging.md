---
sidebar_position: 5
---

# Mobile Logging

> **📖 Complete Documentation**: See [Development/Logging](../Development/logging.md) for comprehensive logging documentation covering Mobile, Web, and API.

## Quick Reference

The mobile app uses structured logging with automatic cloud transport:

```typescript
import { log } from '@/utils/clientLogger';

log.debug('API request payload', { endpoint: '/api/users', data: userData });
log.info('User logged in', { userId: user.id, loginMethod: 'email' });
log.warning('API response slow', { endpoint: '/api/data', responseTime: 3500 });
log.error('API request failed', { endpoint: '/api/users', status: 500 });
```

### Key Features

- **8 RFC 5424 Severity Levels**: `debug, info, notice, warning, error, crit, alert, emerg`
- **Sequential Queue Processing**: Maintains log order during transport
- **Environment-Based Transport**: Console in debug, Google Cloud in release
- **Device Metadata**: Automatic platform, device model, and app version inclusion

## Related Documentation

- **[Development/Logging](../Development/logging.md)** - Complete logging system documentation
- [RFC 5424 Syslog Protocol](https://tools.ietf.org/html/rfc5424#section-6.2.1)
- [react-native-logs](https://github.com/alessandro-bottamedi/react-native-logs)
