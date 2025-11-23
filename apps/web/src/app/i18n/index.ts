import { type Namespace, type FlatNamespace, type KeyPrefix, type TFunction } from 'i18next'
import { type FallbackNs } from 'react-i18next'
import type { AllTranslationKeys } from '@repo/ui'
import i18next from './i18next'
import { headerName } from './settings'
import { headers } from 'next/headers'

type $Tuple<T> = readonly [T?, ...T[]];
type $FirstNamespace<Ns extends Namespace> = Ns extends readonly unknown[] ? Ns[0] : Ns;

// Type-safe version for default namespace (translation)
export async function getT(): Promise<{
  t: TFunction<'translation', undefined>
  i18n: typeof i18next
}>

// Type-safe version for specific namespace
export async function getT<
  Ns extends keyof AllTranslationKeys,
>(
  ns: Ns,
  options?: { keyPrefix?: string }
): Promise<{
  t: TFunction<Ns, undefined>
  i18n: typeof i18next
}>

// Generic version for advanced use cases
export async function getT<
  Ns extends FlatNamespace | $Tuple<FlatNamespace>,
  KPrefix extends KeyPrefix<FallbackNs<Ns extends FlatNamespace ? FlatNamespace : $FirstNamespace<FlatNamespace>>> = undefined
>(
  ns?: Ns,
  options?: { keyPrefix?: KPrefix }
): Promise<{
  t: TFunction<Ns extends keyof AllTranslationKeys ? Ns : 'translation', KPrefix>
  i18n: typeof i18next
}>

export async function getT<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | keyof AllTranslationKeys,
  KPrefix extends KeyPrefix<FallbackNs<Ns extends FlatNamespace ? FlatNamespace : $FirstNamespace<FlatNamespace>>> = undefined
>(
  ns?: Ns,
  options: { keyPrefix?: KPrefix } = {}
) {
  const headerList = await headers()
  const lng = headerList.get(headerName)
  if (lng && i18next.resolvedLanguage !== lng) {
    await i18next.changeLanguage(lng)
  }
  if (ns && !i18next.hasLoadedNamespace(ns as string | string[])) {
    await i18next.loadNamespaces(ns as string | string[])
  }
  return {
    t: Array.isArray(ns) ? i18next.getFixedT(lng, ns[0], options.keyPrefix) : i18next.getFixedT(lng || 'en', ns as FlatNamespace || 'translation', options.keyPrefix),
    i18n: i18next
  }
}
