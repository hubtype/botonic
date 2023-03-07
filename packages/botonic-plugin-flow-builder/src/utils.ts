import { HtMediaFileLocale } from './hubtype-models'

export function getImageByLocale(locale: string, image: HtMediaFileLocale[]) {
  const result = image.find(t => t.locale === locale)
  return result?.file ?? ''
}

export function getWebpackEnvVar(
  webpackEnvVar: string | false,
  name: string,
  defaultValue: string
): string {
  return (
    webpackEnvVar ||
    (typeof process !== 'undefined' && process.env[name]) ||
    defaultValue
  )
}
