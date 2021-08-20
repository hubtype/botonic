// @ts-nocheck
// eslint-disable-next-line filenames/match-regex
export const getString = (locales, locale, stringID) => {
  let l = stringID.split('.').reduce((o, i) => o[i], locales[locale])
  if (l instanceof Array) l = l[Math.floor(Math.random() * l.length)]
  return String(l)
}
