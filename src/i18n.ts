export var lang: string = 'en'

export interface I { (): any; setLocale: Function; getLocale: Function; }

var i18n = <I>((literal_id: any) => {
  try {
    const literals = require(process.cwd() + '/.next/dist/bundles/pages/locales/' + lang).default
    const l = literal_id.split('.').reduce((o: any, i: any) => o[i], literals)
    if(l instanceof Array)
      return l[Math.floor(Math.random() * l.length)]
    return String(l)
  } catch(e) {}
})

i18n.getLocale = () => lang
i18n.setLocale = (l:string) => lang = l

export default i18n