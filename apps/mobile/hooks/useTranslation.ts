import { useTranslation as useTranslationOriginal } from 'react-i18next';
import type { NamespaceKeys, AllTranslationKeys } from '@repo/ui';

/**
 * Type-safe wrapper around useTranslation that provides proper key typing
 * This is a minimal wrapper that just adds type safety without changing behavior
 */
export function useTranslation<NS extends NamespaceKeys = 'translation'>(
  namespace?: NS
) {
  const result = useTranslationOriginal(namespace);
  
  // Type-safe t function
  const t = result.t as (key: AllTranslationKeys[NS], options?: any) => string;
  
  return { ...result, t };
}

export { useTranslation as useTypedTranslation }
