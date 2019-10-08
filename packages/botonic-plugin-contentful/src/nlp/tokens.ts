import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers';
import AggressiveTokenizerEs from 'node-nlp/lib/nlp/tokenizers/aggressive-tokenizer-es';
import AggressiveTokenizerEn from 'node-nlp/lib/nlp/tokenizers/aggressive-tokenizer-en';
import AggressiveTokenizerPt from 'node-nlp/lib/nlp/tokenizers/aggressive-tokenizer-pt';
import { esDefaultStopWords } from './stopwords/stopwords-es';
import { caDefaultStopWords } from './stopwords/stopwords-ca';
import { enDefaultStopWords } from './stopwords/stopwords-en';
import { Locale } from './locales';

export function countOccurrences(haystack: string, needle: string): number {
  let n = 0;
  let pos = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    pos = haystack.indexOf(needle, pos);
    if (pos >= 0) {
      ++n;
      pos += needle.length;
    } else break;
  }
  return n;
}

/**
 * Identical to AggressiveTokenizerEs, except that it maintains ç & Ç
 */
class CatalanTokenizer implements Tokenizer {
  static RESTORE_CEDIL = new RegExp('c' + String.fromCharCode(807), 'gi');
  private esTokenizer = new AggressiveTokenizerEs();

  static restoreAfterTokenizer(text: string) {
    return text.replace(CatalanTokenizer.RESTORE_CEDIL, 'ç');
  }

  tokenize(text: string, normalize = true): string[] {
    let normalized = text;
    if (normalize) {
      normalized = text.normalize('NFD');
      normalized = CatalanTokenizer.restoreAfterTokenizer(normalized);
      normalized = normalized.replace(/[\u0300-\u036f]/g, '');
    }
    return this.esTokenizer.trim(normalized.split(/[^a-zA-Zá-úÁ-ÚñÑüÜ]+/));
  }
}

const tokenizers: { [locale: string]: Tokenizer } = {
  es: new AggressiveTokenizerEs(),
  en: new AggressiveTokenizerEn(),
  ca: new CatalanTokenizer(),
  pt: new AggressiveTokenizerPt()
};

export function tokenizerPerLocale(locale: Locale): Tokenizer {
  return tokenizers[locale];
}

export const DEFAULT_SEPARATORS_REGEX = new RegExp('[;,./()]', 'g');

export const DEFAULT_STOP_WORDS: { [key: string]: string[] } = {
  es: esDefaultStopWords,
  ca: caDefaultStopWords,
  en: enDefaultStopWords
};
