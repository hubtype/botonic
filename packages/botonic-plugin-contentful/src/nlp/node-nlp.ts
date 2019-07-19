import { Locale } from './index';
import { stemmerFor } from './stemmer';
import { caDefaultStopWords } from './stopwords/stopwords-ca';
import { enDefaultStopWords } from './stopwords/stopwords-en';
import { esDefaultStopWords } from './stopwords/stopwords-es';

export const DEFAULT_STOP_WORDS: { [key: string]: string[] } = {
  es: esDefaultStopWords,
  ca: caDefaultStopWords,
  en: enDefaultStopWords
};

function normalize(locale: Locale): string[] {
  const stemmer = stemmerFor(locale);
  return DEFAULT_STOP_WORDS[locale].map(
    sw => stemmer.tokenizeAndStem(sw, true)[0]
  );
}

const STEMMED_STOP_WORDS: { [key: string]: string[] } = {
  es: normalize('es'),
  ca: normalize('ca'),
  en: normalize('en')
};

export const DEFAULT_SEPARATORS_REGEX = new RegExp('[;,./()]', 'g');

export function tokenizeAndStem(
  locale: Locale,
  inputText: string,
  stopWords?: string[],
  separators = DEFAULT_SEPARATORS_REGEX
): string[] {
  // Depending on the language, node-nlp tokenizers use different separators
  // (eg. in Catalan they miss some obvious ones which Spanish have)
  inputText = inputText.replace(separators, ' ');
  inputText = inputText.trim();
  stopWords = stopWords || STEMMED_STOP_WORDS[locale];
  const stemmer = stemmerFor(locale);
  let tokens: string[] = stemmer.tokenizeAndStem(
    inputText,
    // keeping stops because it cannot be configured (node-nlp/lib/nlp/stopwords/stopwords_es.json) and:
    // the default list contains 'donde', which may help to interpret intent in a sentence
    true
  );
  // Maybe we should filter stopwords before stemmer, because stemmer removes some final letters
  // But we should do it between tokenizer and stemmer, which is not possible
  return tokens.filter(t => !stopWords!.includes(t));
}
