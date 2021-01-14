import Stemmer from '@nlpjs/core/src/stemmer'

import { SingletonMap } from '../util'
import * as locales from './locales'
import { languageFromLocale, Locale } from './locales'

// see https://github.com/axa-group/nlp.js/blob/HEAD/docs/language-support.md
// and https://stackoverflow.com/a/11210358/145289
// snowball algorithm inspired from https://github.com/MihaiValentin/lunr-languages, based on
// https://github.com/fortnightlabs/snowball-js/blob/master/stemmer/src/ext/SpanishStemmer.js based on
// java version at http://snowball.tartarus.org/download.html
const stemmers = new SingletonMap<Stemmer>({
  [locales.CATALAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerCa = require('@nlpjs/lang-ca/src/stemmer-ca')
    return new StemmerCa()
  },
  [locales.ENGLISH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerEn = require('@nlpjs/lang-en-min/src/stemmer-en')
    return new StemmerEn()
  },
  [locales.SPANISH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerEs = require('@nlpjs/lang-es/src/stemmer-es')
    return new StemmerEs()
  },
  [locales.POLISH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerPl = require('@nlpjs/lang-pl/src/stemmer-pl')
    return new StemmerPl()
  },
  [locales.PORTUGUESE]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerPt = require('@nlpjs/lang-pt/src/stemmer-pt')
    return new StemmerPt()
  },
  [locales.RUSSIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerRu = require('@nlpjs/lang-ru/src/stemmer-ru')
    return new StemmerRu()
  },
  [locales.TURKISH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerTr = require('@nlpjs/lang-tr/src/stemmer-tr')
    return new StemmerTr()
  },
  [locales.ITALIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerIt = require('@nlpjs/lang-it/src/stemmer-it')
    return new StemmerIt()
  },
  [locales.FRENCH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerFr = require('@nlpjs/lang-fr/src/stemmer-fr')
    return new StemmerFr()
  },
  [locales.GERMAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerDe = require('@nlpjs/lang-de/src/stemmer-de')
    return new StemmerDe()
  },
  [locales.ROMANIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerRo = require('@nlpjs/lang-ro/src/stemmer-ro')
    return new StemmerRo()
  },
  [locales.GREEK]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerEl = require('@nlpjs/lang-el/src/stemmer-el')
    return new StemmerEl()
  },
  [locales.CZECH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerCs = require('@nlpjs/lang-cs/src/stemmer-cs')
    return new StemmerCs()
  },
  [locales.UKRAINIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerUk = require('@nlpjs/lang-uk/src/stemmer-uk')
    return new StemmerUk()
  },
  [locales.CROATIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require
    const { StemmerHr } = require('./stemmers/stemmer-hr')
    return new StemmerHr()
  },
  [locales.SLOVAK]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require
    const { StemmerSk } = require('./stemmers/stemmer-sk')
    return new StemmerSk()
  },
  [locales.SLOVENIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StemmerSl = require('@nlpjs/lang-sl/src/stemmer-sl')
    return new StemmerSl()
  },
  [locales.HUNGARIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require
    const { StemmerHu } = require('@nlpjs/lang-hu/src/stemmer-hu')
    return new StemmerHu()
  },
})

export function stemmerFor(locale: Locale): Stemmer {
  const stem = stemmers.value(languageFromLocale(locale))
  if (!stem) {
    throw new Error(`No stemmer configured for locale '${locale}'`)
  }
  return stem
}
