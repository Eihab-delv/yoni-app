---
sidebar_position: 9
---

# Internationalisation (i18n)

The ts-monorepo uses [i18next](https://www.i18next.com/) for internationalisation across mobile and web applications, with shared translation resources managed in the `@repo/ui` package. All implementations support automatic language detection, persistent preferences, and full TypeScript type safety.

## Quick Start

### Mobile

```typescript
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return <Text>{t('welcome')}</Text>;
  
  // Change language
  i18n.changeLanguage('de'); // German
}
```

### Web

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

## Supported Languages

- **English** (`en`) - Default/fallback language (fully supported)
- **German** (`de`) - Partially supported  
- **Italian** (`it`) - Partially supported

## Shared Translation Structure

Translations are centralised in `@repo/ui` and organised by namespace:

```text
packages/ui/src/translations/
├── en/
│   ├── translation.json      # Default namespace
│   ├── client-page.json
│   ├── footer.json
│   ├── second-page.json
│   └── second-client-page.json
├── de/ (same structure)
└── it/ (same structure)
```

### Example Translation File

```json
// packages/ui/src/translations/en/translation.json
{
  "h1": "A simple example",
  "title": "Home", 
  "welcome": "Welcome to the app",
  "to-second-page": "To second page",
  "blog": {
    "text": "Check out the blog post",
    "link": "https://example.com"
  }
}
```

## Type Safety

Both mobile and web have full TypeScript support with auto-generated types:

```typescript
// Type-safe usage
const { t } = useTranslation(); // t is fully typed
const text = t('welcome'); // ✅ Valid key
const invalid = t('nonexistent'); // ❌ TypeScript error
```

## Mobile Implementation

### Type-Safe Hook (`apps/mobile/hooks/useTranslation.ts`)

```typescript
import { useTranslation as useTranslationOriginal } from 'react-i18next';
import type { NamespaceKeys, AllTranslationKeys } from '@repo/ui';

export function useTranslation<NS extends NamespaceKeys = 'translation'>(
  namespace?: NS
) {
  const result = useTranslationOriginal(namespace);
  const t = result.t as (key: AllTranslationKeys[NS]) => string;
  return { ...result, t };
}
```

## Web Implementation

### Next.js App Router Integration

The web app uses advanced Next.js 13+ app router integration with server and client components:

Languages are detected from URL path: `/en/page`, `/de/page`, `/it/page`

```typescript
// apps/web/src/middleware.ts
export function middleware(req: NextRequest) {
  // Automatic language detection and redirection
  if (!languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`))) {
    const language = acceptLanguage.get(req.headers.get('Accept-Language')) || fallbackLng
    return NextResponse.redirect(new URL(`/${language}${req.nextUrl.pathname}`, req.url))
  }
}
```

## Advanced Usage

### Using Namespaces

```typescript
// Mobile
const { t } = useTranslation('client-page');
const title = t('title'); // From client-page namespace

// Web Server
const { t } = await getT('footer');
const description = t('description');

// Web Client  
const { t } = useT('second-page');
const heading = t('h1');
```

### Nested Translation Keys

```json
{
  "blog": {
    "text": "Check out the blog",
    "link": "https://example.com"
  }
}
```

```typescript
const blogText = t('blog.text');  // "Check out the blog"
const blogLink = t('blog.link');  // "https://example.com"
```

### Language Switching

```typescript
// Mobile
const { i18n } = useTranslation();
i18n.changeLanguage('de'); // Persisted to AsyncStorage

// Web Client Component  
const { i18n } = useT();
// Language switching handled by URL navigation

// Web Language Switcher Component
<Link href={`/${newLanguage}${currentPath}`}>
  Switch to {newLanguage}
</Link>
```

## Environment Behavior

### Mobile Environment

- **Language Detection**: Device locale → AsyncStorage → Manual override
- **Persistence**: AsyncStorage saves user preference
- **Hot Reload**: Language changes apply immediately

### Web Environment

- **Language Detection**: URL path → Cookie → Browser → Device locale
- **Persistence**: Cookie + URL-based routing
- **SSR Support**: Server-side rendering with proper language context

## Adding New Languages

1. **Add translation files** in `packages/ui/src/translations/[lang]/`
2. **Update translations object** in `packages/ui/src/translations/index.ts`:

```typescript
export const translations = {
  en: { /* existing */ },
  de: { /* existing */ },
  it: { /* existing */ },
  fr: { // Add new language
    translation: frTranslation,
    "client-page": frClientPage,
    // ... other namespaces
  }
};
```

3. **Add to settings**:
   - Web: `apps/web/src/app/i18n/settings.ts`
   - Both will automatically pick up new languages from translations

## Best Practices

```typescript
// ✅ Good: Descriptive keys
const message = t('user.login.success');

// ❌ Bad: Generic keys  
const message = t('message1');

// ✅ Good: Use namespaces for organisation
const { t } = useTranslation('auth');
const title = t('login.title');

// ✅ Good: Include context for translators
{
  "button.save": "Save", // Button text
  "status.saving": "Saving...", // Progress indicator
  "message.saved": "Your changes have been saved." // Success message
}

// ✅ Good: Use interpolation for dynamic content
{
  "greeting": "Hello, {{name}}!"
}
const greeting = t('greeting', { name: user.name });
```

## Related Documentation

- **[Mobile Internationalisation](../Mobile/internationalisation.md)** - Mobile-specific quick reference
- **[Web Internationalisation](../Web/internationalisation.md)** - Web-specific quick reference  
- **[i18next Documentation](https://www.i18next.com/)**
- **[react-i18next Documentation](https://react.i18next.com/)**
- **[Next.js Internationalisation](https://nextjs.org/docs/advanced-features/i18n)**
