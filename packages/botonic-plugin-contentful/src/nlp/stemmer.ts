import { Stemmer } from '@nlpjs/core/src'
import StemmerCa from '@nlpjs/lang-ca/src/stemmer-ca'
import StemmerCs from '@nlpjs/lang-cs/src/stemmer-cs'
import StemmerDe from '@nlpjs/lang-de/src/stemmer-de'
import StemmerEl from '@nlpjs/lang-el/src/stemmer-el'
import StemmerEn from '@nlpjs/lang-en-min/src/stemmer-en'
import StemmerEs from '@nlpjs/lang-es/src/stemmer-es'
import StemmerFr from '@nlpjs/lang-fr/src/stemmer-fr'
import StemmerIt from '@nlpjs/lang-it/src/stemmer-it'
import StemmerPt from '@nlpjs/lang-pt/src/stemmer-pt'
import StemmerRo from '@nlpjs/lang-ro/src/stemmer-ro'
import StemmerRu from '@nlpjs/lang-ru/src/stemmer-ru'
import StemmerTr from '@nlpjs/lang-tr/src/stemmer-tr'
import StemmerUk from '@nlpjs/lang-uk/src/stemmer-uk'

import { languageFromLocale, Locale } from './locales'
import { StemmerPl } from './stemmers/polish-stemmer'
import { StemmerHr } from './stemmers/stemmer-hr'
import { StemmerSk } from './stemmers/stemmer-sk'

// see https://github.com/axa-group/nlp.js/blob/HEAD/docs/language-support.md
// and https://stackoverflow.com/a/11210358/145289
// snowball algorithm inspired from https://github.com/MihaiValentin/lunr-languages, based on
// https://github.com/fortnightlabs/snowball-js/blob/master/stemmer/src/ext/SpanishStemmer.js based on
// java version at http://snowball.tartarus.org/download.html
const stemmers: { [key: string]: Stemmer } = {
  ca: new StemmerCa(),
  en: new StemmerEn(),
  es: new StemmerEs(),
  pl: new StemmerPl(),
  pt: new StemmerPt(),
  ru: new StemmerRu(),
  tr: new StemmerTr(),
  it: new StemmerIt(),
  fr: new StemmerFr(),
  de: new StemmerDe(),
  ro: new StemmerRo(),
  el: new StemmerEl(),
  cs: new StemmerCs(),
  uk: new StemmerUk(),
  hr: new StemmerHr(),
  sk: new StemmerSk(),
}

export function stemmerFor(locale: Locale): Stemmer {
  const stem = stemmers[languageFromLocale(locale)]
  if (!stem) {
    throw new Error(`No stemmer configured for locale '${locale}'`)
  }
  return stem
}
