import Stemmer from '@nlpjs/core/src/stemmer'

import { SingletonMap } from '../util'
import { languageFromLocale, Locale } from './locales'
import { StemmerHr } from './stemmers/stemmer-hr'
import { StemmerSk } from './stemmers/stemmer-sk'

// see https://github.com/axa-group/nlp.js/blob/HEAD/docs/language-support.md
// and https://stackoverflow.com/a/11210358/145289
// snowball algorithm inspired from https://github.com/MihaiValentin/lunr-languages, based on
// https://github.com/fortnightlabs/snowball-js/blob/master/stemmer/src/ext/SpanishStemmer.js based on
// java version at http://snowball.tartarus.org/download.html
const stemmers = new SingletonMap<Stemmer>({
  ca: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerCa = require('@nlpjs/lang-ca/src/stemmer-ca')
    return new StemmerCa()
  },
  en: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerEn = require('@nlpjs/lang-en-min/src/stemmer-en')
    return new StemmerEn()
  },
  es: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerEs = require('@nlpjs/lang-es/src/stemmer-es')
    return new StemmerEs()
  },
  pl: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerPl = require('@nlpjs/lang-pl/src/stemmer-pl')
    return new StemmerPl()
  },
  pt: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerPt = require('@nlpjs/lang-pt/src/stemmer-pt')
    return new StemmerPt()
  },
  ru: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerRu = require('@nlpjs/lang-ru/src/stemmer-ru')
    return new StemmerRu()
  },
  tr: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerTr = require('@nlpjs/lang-tr/src/stemmer-tr')
    return new StemmerTr()
  },
  it: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerIt = require('@nlpjs/lang-it/src/stemmer-it')
    return new StemmerIt()
  },
  fr: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerFr = require('@nlpjs/lang-fr/src/stemmer-fr')
    return new StemmerFr()
  },
  de: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerDe = require('@nlpjs/lang-de/src/stemmer-de')
    return new StemmerDe()
  },
  ro: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerRo = require('@nlpjs/lang-ro/src/stemmer-ro')
    return new StemmerRo()
  },
  el: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerEl = require('@nlpjs/lang-el/src/stemmer-el')
    return new StemmerEl()
  },
  cs: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerCs = require('@nlpjs/lang-cs/src/stemmer-cs')
    return new StemmerCs()
  },
  uk: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerUk = require('@nlpjs/lang-uk/src/stemmer-uk')
    return new StemmerUk()
  },
  hr: () => new StemmerHr(),
  sk: () => new StemmerSk(),
})

export function stemmerFor(locale: Locale): Stemmer {
  const stem = stemmers.value(languageFromLocale(locale))
  if (!stem) {
    throw new Error(`No stemmer configured for locale '${locale}'`)
  }
  return stem
}
