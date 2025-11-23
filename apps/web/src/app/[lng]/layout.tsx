import './global.css'

import { dir } from 'i18next'
import { languages } from '../i18n/settings'
import { getT } from '../i18n'
import type { Metadata } from 'next'
import Providers from '~/components/Providers'
import { genMetadata } from '~/lib/metadata'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return genMetadata({
    title: t('title'),
  })
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string; }>;
}) {
  const { lng } = await params
  return (
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
