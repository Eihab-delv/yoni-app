---
sidebar_position: 2
---

# Web Internationalisation

> **📖 Complete Documentation**: See [Development/Internationalisation](../Development/internationalisation.md) for comprehensive i18n documentation covering Mobile, Web, and shared systems.

## Quick Reference

The web app uses i18next with Next.js 13+ app router and shared translations:

```typescript
// Server Component
import { getT } from '~/app/i18n';

export default async function Page() {
  const { t } = await getT();
  return <h1>{t('h1')}</h1>;
}

// Client Component
'use client'
import { useT } from '~/app/i18n/client';

export default function ClientPage() {
  const { t } = useT();
  return <h1>{t('h1')}</h1>;
}
```

### Key Features

- **Universal Interface**: Same API for server and client components
- **URL-based Routing**: Languages detected from path (`/en/page`, `/de/page`)
- **Shared Resources**: Centralised translations in `@repo/ui` package
- **Type Safety**: Full TypeScript support with auto-generated types
- **SSR Support**: Server-side rendering with proper language context

### Language Routing

Languages are automatically detected and routed:

```text
/en/page    # English version
/de/page    # German version  
/it/page    # Italian version
```

### Using Namespaces

```typescript
// Server Component
const { t } = await getT('footer');
const description = t('description');

// Client Component
const { t } = useT('second-page');
const heading = t('h1');
```

### Language Switching

```typescript
// Language switcher component
import Link from 'next/link'

<Link href={`/${newLanguage}${currentPath}`}>
  Switch to {newLanguage}
</Link>
```

### Trans Component for Complex Translations

```typescript
import { Trans } from 'react-i18next/TransWithoutContext'

<Trans t={t} i18nKey="welcome">
  Welcome to Next.js v13 <small>appDir</small> and i18next
</Trans>

// JSON: { "welcome": "Welcome to Next.js v13 <1>{{version}}</1> and i18next" }
```

## Related Documentation

- **[Development/Internationalisation](../Development/internationalisation.md)** - Complete i18n system documentation
- **[Next.js Internationalisation](https://nextjs.org/docs/advanced-features/i18n)**
- **[react-i18next](https://react.i18next.com/)**
