---
sidebar_position: 3
---

# Web Logging

> **📖 Complete Documentation**: See [Development/Logging](../Development/logging.md) for comprehensive logging documentation covering Mobile, Web, and API.

## Quick Reference

The web app uses a universal logger that works on both client and server:

```typescript
import { logger } from '~/lib/logger';

logger.debug('Component rendered', { componentName: 'UserProfile', props });
logger.info('API call successful', { endpoint: '/api/users', duration: 120 });
logger.warning('Deprecated API used', { endpoint: '/api/old', alternative: '/api/v2' });
logger.error('Validation failed', { field: 'email', value: 'invalid@' });
```

### Key Features

- **Universal Interface**: Same API for client and server environments
- **Automatic Routing**: Client logs sent to server API, server logs go directly to Cloud Logging
- **Browser Console**: Client-side logs also appear in browser console
- **Structured Metadata**: Support for complex object logging

### Implementation

- **Client Side**: Logs to browser console, Roarr, and server API endpoint
- **Server Side**: Direct Google Cloud Logging integration with structured format
- **API Route**: `/api/log` handles client-side log transport

## Related Documentation

- **[Development/Logging](../Development/logging.md)** - Complete logging system documentation
- [RFC 5424 Syslog Protocol](https://tools.ietf.org/html/rfc5424#section-6.2.1)
- [Roarr Logger](https://github.com/gajus/roarr)