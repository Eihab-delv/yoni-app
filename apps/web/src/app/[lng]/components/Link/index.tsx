import React from 'react'
import { getT } from '../../../i18n'
import { LinkBase } from './LinkBase'

export const Link = async ({ href, children }: {
  href?: string;
  children?: React.ReactNode;
}) => {
  const { i18n } = await getT()
  return <LinkBase lng={i18n.resolvedLanguage} href={href}>{children}</LinkBase>
}
