---
sidebar_position: 4
---

# Mobile Internationalisation

> **📖 Complete Documentation**: See [Development/Internationalisation](../Development/internationalisation.md) for comprehensive i18n documentation covering Mobile, Web, and shared systems.

## Quick Reference

The mobile app uses i18next with shared translations and type safety:

```typescript
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return <Text>{t('welcome')}</Text>;
  
  // Change language
  i18n.changeLanguage('de'); // German
  i18n.changeLanguage('it'); // Italian
  i18n.changeLanguage('en'); // English
}
```

### Key Features

- **Shared Resources**: Centralised translations in `@repo/ui` package
- **Auto Detection**: Uses device locale, persisted in AsyncStorage
- **Type Safety**: Full TypeScript support with auto-generated types
- **Hot Reload**: Language changes apply immediately

### Supported Languages

- **English** (`en`) - Default/fallback language (fully supported)
- **German** (`de`) - Partially supported
- **Italian** (`it`) - Partially supported

### Using Namespaces

```typescript
const { t } = useTranslation('client-page');
const title = t('title'); // From client-page namespace

// Nested keys
const blogText = t('blog.text'); // For { "blog": { "text": "..." } }
```

### Navigation Integration

```typescript
export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: t("h1") });
  }, [navigation, t]);

  return <ThemedText>{t('welcome')}</ThemedText>;
}
```

## Related Documentation

- **[Development/Internationalisation](../Development/internationalisation.md)** - Complete i18n system documentation
- **[Expo Localisation](https://docs.expo.dev/versions/latest/sdk/localisation/)**
- **[react-i18next](https://react.i18next.com/)**
