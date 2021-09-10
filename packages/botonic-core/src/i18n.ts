// eslint-disable-next-line filenames/match-regex
import { Locales } from './models'

export const getString = (
  locales: Locales,
  locale: string,
  stringID: string
): string => {
  let l = stringID.split('.').reduce((o, i) => o[i], locales[locale])
  if (l instanceof Array) l = l[Math.floor(Math.random() * l.length)]
  return String(l)
}
