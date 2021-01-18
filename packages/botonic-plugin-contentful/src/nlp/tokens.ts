import Tokenizer from '@nlpjs/core/src/tokenizer'

import { SingletonMap } from '../util'
import { languageFromLocale, Locale } from './locales'
import * as locales from './locales'
import { bgDefaultStopWords } from './stopwords/stopwords-bg'
import { caDefaultStopWords } from './stopwords/stopwords-ca'
import { csDefaultStopWords } from './stopwords/stopwords-cs'
import { deDefaultStopWords } from './stopwords/stopwords-de'
import { elDefaultStopWords } from './stopwords/stopwords-el'
import { enDefaultStopWords } from './stopwords/stopwords-en'
import { esDefaultStopWords } from './stopwords/stopwords-es'
import { frDefaultStopWords } from './stopwords/stopwords-fr'
import { hrDefaultStopWords } from './stopwords/stopwords-hr'
import { huDefaultStopWords } from './stopwords/stopwords-hu'
import { itDefaultStopWords } from './stopwords/stopwords-it'
import { nlDefaultStopWords } from './stopwords/stopwords-nl'
import { plDefaultStopWords } from './stopwords/stopwords-pl'
import { ptDefaultStopWords } from './stopwords/stopwords-pt'
import { roDefaultStopWords } from './stopwords/stopwords-ro'
import { ruDefaultStopWords } from './stopwords/stopwords-ru'
import { skDefaultStopWords } from './stopwords/stopwords-sk'
import { slDefaultStopWords } from './stopwords/stopwords-sl'
import { trDefaultStopWords } from './stopwords/stopwords-tr'
import { ukDefaultStopWords } from './stopwords/stopwords-uk'

export function countOccurrences(haystack: string, needle: string): number {
  let n = 0
  let pos = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    pos = haystack.indexOf(needle, pos)
    if (pos >= 0) {
      ++n
      pos += needle.length
    } else break
  }
  return n
}

/**
 * Not using TokenizerCa from node-nlp because it does not stem correctly some
 * "pronoms febles" (eg. adonar-se'n)
 * It maintains ç & Ç, but maybe we should only do it when normalize=true?
 */
export class TokenizerCa implements Tokenizer {
  static RESTORE_CEDIL = new RegExp('c' + String.fromCharCode(807), 'gi')
  static SPLIT_REGEX = TokenizerCa.splitRegex()

  static splitRegex(): RegExp {
    const aLetter = 'a-zA-Zá-úÁ-ÚñÑüÜ'
    const pronomFebleEnding = `[-'](?=[${aLetter}])`
    const separator = `\\s,.!?;:([\\]'"¡¿)`
    const slashNotNumber = `/(?=[^0-9])`
    return new RegExp(`${pronomFebleEnding}|[${separator}]+|${slashNotNumber}+`)
  }

  static restoreAfterTokenizer(text: string) {
    return text.replace(TokenizerCa.RESTORE_CEDIL, 'ç')
  }

  tokenize(text: string, normalize = true): string[] {
    let normalized = text
    if (normalize) {
      normalized = text.normalize('NFD')
      normalized = TokenizerCa.restoreAfterTokenizer(normalized)
      normalized = normalized.replace(/[\u0300-\u036f]/g, '')
    }
    return this.trim(normalized.split(TokenizerCa.SPLIT_REGEX))
  }

  private trim(arr: string[]): string[] {
    while (arr[arr.length - 1] === '') {
      arr.pop()
    }
    while (arr[0] === '') {
      arr.shift()
    }
    return arr
  }
}

const lazyTokenizers = new SingletonMap<Tokenizer>({
  [locales.SPANISH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerEs = require('@nlpjs/lang-es/src/tokenizer-es')
    return new TokenizerEs()
  },
  [locales.ENGLISH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerEn = require('@nlpjs/lang-en-min/src/tokenizer-en')
    return new TokenizerEn()
  },
  [locales.CATALAN]: () => {
    return new TokenizerCa()
  },
  [locales.POLISH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerPl = require('@nlpjs/lang-pl/src/tokenizer-pl')
    return new TokenizerPl()
  },
  [locales.PORTUGUESE]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerPt = require('@nlpjs/lang-pt/src/tokenizer-pt')
    return new TokenizerPt()
  },
  [locales.RUSSIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerRu = require('@nlpjs/lang-ru/src/tokenizer-ru')
    return new TokenizerRu()
  },
  [locales.TURKISH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerTr = require('@nlpjs/lang-tr/src/tokenizer-tr')
    return new TokenizerTr()
  },
  [locales.ITALIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerIt = require('@nlpjs/lang-it/src/tokenizer-it')
    return new TokenizerIt()
  },
  [locales.FRENCH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerFr = require('@nlpjs/lang-fr/src/tokenizer-fr')
    return new TokenizerFr()
  },
  [locales.GERMAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerDe = require('@nlpjs/lang-de/src/tokenizer-de')
    return new TokenizerDe()
  },
  [locales.ROMANIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerRo = require('@nlpjs/lang-ro/src/tokenizer-ro')
    return new TokenizerRo()
  },
  [locales.GREEK]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerEl = require('@nlpjs/lang-el/src/tokenizer-el')
    return new TokenizerEl()
  },
  [locales.CZECH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerCs = require('@nlpjs/lang-cs/src/tokenizer-cs')
    return new TokenizerCs()
  },
  [locales.UKRAINIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerUk = require('@nlpjs/lang-uk/src/tokenizer-uk')
    return new TokenizerUk()
  },
  [locales.CROATIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require
    const { TokenizerHr } = require('./tokenizers/tokenizer-hr')
    return new TokenizerHr()
  },
  [locales.SLOVAK]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require
    const { TokenizerSk } = require('./tokenizers/tokenizer-sk')
    return new TokenizerSk()
  },
  [locales.SLOVENIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerSl = require('@nlpjs/lang-sl/src/tokenizer-sl')
    return new TokenizerSl()
  },
  [locales.HUNGARIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerHu = require('@nlpjs/lang-hu/src/tokenizer-hu')
    return new TokenizerHu()
  },
  [locales.DUTCH]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TokenizerNl = require('@nlpjs/lang-nl/src/tokenizer-nl')
    return new TokenizerNl()
  },
  [locales.BULGARIAN]: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require
    const { TokenizerBg } = require('./tokenizers/tokenizer-bg')
    return new TokenizerBg()
  },
})

export function tokenizerPerLocale(locale: Locale): Tokenizer {
  return lazyTokenizers.value(languageFromLocale(locale))
}

export const DEFAULT_SEPARATORS = ';,./()!?" '
export const DEFAULT_SEPARATORS_REGEX = new RegExp(
  '[' + DEFAULT_SEPARATORS + ']',
  'g'
)
export const DEFAULT_NOT_SEPARATORS_REGEX = new RegExp(
  '[^' + DEFAULT_SEPARATORS + ']',
  'g'
)

export const DEFAULT_STOP_WORDS: { [key: string]: string[] } = {
  es: esDefaultStopWords,
  ca: caDefaultStopWords,
  en: enDefaultStopWords,
  pl: plDefaultStopWords,
  pt: ptDefaultStopWords,
  ru: ruDefaultStopWords,
  tr: trDefaultStopWords,
  it: itDefaultStopWords,
  fr: frDefaultStopWords,
  de: deDefaultStopWords,
  ro: roDefaultStopWords,
  el: elDefaultStopWords,
  cs: csDefaultStopWords,
  uk: ukDefaultStopWords,
  hr: hrDefaultStopWords,
  sk: skDefaultStopWords,
  sl: slDefaultStopWords,
  hu: huDefaultStopWords,
  nl: nlDefaultStopWords,
  bg: bgDefaultStopWords,
}

export function stopWordsFor(locale: string): string[] {
  return DEFAULT_STOP_WORDS[languageFromLocale(locale)]
}
