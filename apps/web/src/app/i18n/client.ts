'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type FlatNamespace, type KeyPrefix } from 'i18next'
import type { AllTranslationKeys, NamespaceKeys } from '@repo/ui'
import i18next from './i18next'
import { useTranslation, type UseTranslationOptions, type UseTranslationResponse, type FallbackNs } from 'react-i18next'

const runsOnServerSide = typeof window === 'undefined'

// Type-safe version for default namespace (translation)
export function useT(): UseTranslationResponse<'translation', undefined>

// Type-safe version for specific namespace
export function useT<Ns extends keyof AllTranslationKeys>(
  ns: Ns,
  options?: UseTranslationOptions<undefined>
): UseTranslationResponse<Ns, undefined>

export function useT<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix>

export function useT<
  Ns extends FlatNamespace | keyof AllTranslationKeys,
  KPrefix extends KeyPrefix<FallbackNs<Ns extends FlatNamespace ? Ns : 'translation'>> = undefined
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
) {
  const lng = useParams()?.lng
  if (typeof lng !== 'string') throw new Error('useT is only available inside /app/[lng]')
  if (runsOnServerSide && i18next.resolvedLanguage !== lng) {
    i18next.changeLanguage(lng)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18next.resolvedLanguage) return
      setActiveLng(i18next.resolvedLanguage)
    }, [activeLng])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18next.resolvedLanguage === lng) return
      i18next.changeLanguage(lng)
    }, [lng])
  }
  return useTranslation(ns as NamespaceKeys, options)
}
