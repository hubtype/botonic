import { HtMediaFileLocale } from './hubtype-models'

export function getImageByLocale(locale: string, image: HtMediaFileLocale[]) {
  const result = image.find(t => t.locale == locale)
  return result?.file ?? ''
}
