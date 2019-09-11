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

export class StemmerEscaper {
  /**
   *
   * @param blackList they'll be searched case-insensitively. The first item of each list is the token we want to generate
   * The rest are other accepted spellings. Eg. [['camión','camion', 'camiones'],['casa']]
   */
  constructor(readonly blackList: string[][]) {}

  escape(input: string): string {
    // eslint-disable-next-line prefer-const
    for (const [i, words] of this.blackList.entries()) {
      for (const word of words) {
        input = input.replace(this.wordRegex(word, 'gi'), this.escapedFor(i));
      }
    }
    return input;
  }

  unescape(escaped: string): string {
    for (const [i, words] of this.blackList.entries()) {
      const token = words[0].toLowerCase();
      //TODO cache unescape regex
      escaped = escaped.replace(this.wordRegex(this.escapedFor(i)), token);
    }
    return escaped;
  }

  private escapedFor(index: number): string {
    return 'x' + 'z'.repeat(index + 1) + 'x';
  }

  private wordRegex(word: string, flags?: string): RegExp {
    return new RegExp('\\b' + word + '\\b', flags);
  }
}

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
  const tokens: string[] = stemmer.tokenizeAndStem(
    inputText,
    // keeping stops because it cannot be configured (node-nlp/lib/nlp/stopwords/stopwords_es.json) and:
    // the default list contains 'donde', which may help to interpret intent in a sentence
    true
  );
  // TODO We should remove from whole input text, because it's not possible to do it between tokenizer and stemmer
  // this has the advantage that the stopwords could have more than 1 word
  const noStopWords = tokens.filter(t => !stopWords!.includes(t));

  if (noStopWords.length == 0) {
    console.log(`'${inputText}' only contains stopwords. Not removing them`);
    return tokens;
  }
  return noStopWords;
}
