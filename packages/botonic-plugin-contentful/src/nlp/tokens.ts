import { Tokenizer } from '@nlpjs/core/src'
import TokenizerDe from '@nlpjs/lang-de/src/tokenizer-de'
import TokenizerEn from '@nlpjs/lang-en-min/src/tokenizer-en'
import TokenizerEs from '@nlpjs/lang-es/src/tokenizer-es'
import TokenizerFr from '@nlpjs/lang-fr/src/tokenizer-fr'
import TokenizerIt from '@nlpjs/lang-it/src/tokenizer-it'
import TokenizerPl from '@nlpjs/lang-pl/src/tokenizer-pl'
import TokenizerPt from '@nlpjs/lang-pt/src/tokenizer-pt'
import TokenizerRu from '@nlpjs/lang-ru/src/tokenizer-ru'
import TokenizerTr from '@nlpjs/lang-tr/src/tokenizer-tr'

import { Locale, rootLocale } from './locales'
import * as locales from './locales'
import { caDefaultStopWords } from './stopwords/stopwords-ca'
import { deDefaultStopWords } from './stopwords/stopwords-de'
import { enDefaultStopWords } from './stopwords/stopwords-en'
import { esDefaultStopWords } from './stopwords/stopwords-es'
import { frDefaultStopWords } from './stopwords/stopwords-fr'
import { itDefaultStopWords } from './stopwords/stopwords-it'
import { plDefaultStopWords } from './stopwords/stopwords-pl'
import { ptDefaultStopWords } from './stopwords/stopwords-pt'
import { ruDefaultStopWords } from './stopwords/stopwords-ru'
import { trDefaultStopWords } from './stopwords/stopwords-tr'

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

const tokenizers: { [locale: string]: Tokenizer } = {
  [locales.SPANISH]: new TokenizerEs(),
  [locales.ENGLISH]: new TokenizerEn(),
  [locales.CATALAN]: new TokenizerCa(),
  [locales.POLISH]: new TokenizerPl(),
  [locales.PORTUGUESE]: new TokenizerPt(),
  [locales.RUSSIAN]: new TokenizerRu(),
  [locales.TURKISH]: new TokenizerTr(),
  [locales.ITALIAN]: new TokenizerIt(),
  [locales.FRENCH]: new TokenizerFr(),
  [locales.GERMAN]: new TokenizerDe(),
}

export function tokenizerPerLocale(locale: Locale): Tokenizer {
  return tokenizers[rootLocale(locale)]
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
}
