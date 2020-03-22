import { Tokenizer } from '@nlpjs/core/src'
import TokenizerEs from '@nlpjs/lang-es/src/tokenizer-es'
import TokenizerEn from '@nlpjs/lang-en-min/src/tokenizer-en'
import TokenizerPt from '@nlpjs/lang-pt/src/tokenizer-pt'
import { esDefaultStopWords } from './stopwords/stopwords-es'
import { caDefaultStopWords } from './stopwords/stopwords-ca'
import { enDefaultStopWords } from './stopwords/stopwords-en'
import { Locale } from './locales'
import { plDefaultStopWords } from './stopwords/stopwords-pl'
import { ptDefaultStopWords } from './stopwords/stopwords-pt'

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
  es: new TokenizerEs(),
  en: new TokenizerEn(),
  ca: new TokenizerCa(),
  pl: new Tokenizer(),
  pt: new TokenizerPt(),
}

export function tokenizerPerLocale(locale: Locale): Tokenizer {
  return tokenizers[locale]
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
}
