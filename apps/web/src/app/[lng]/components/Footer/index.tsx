import { getT } from '../../../i18n'
import { FooterBase } from './FooterBase'

export const Footer = async ({ path }: {
  path?: string;
}) => {
  const { i18n } = await getT('footer')
  return <FooterBase i18n={i18n} lng={i18n.resolvedLanguage} path={path} />
}
