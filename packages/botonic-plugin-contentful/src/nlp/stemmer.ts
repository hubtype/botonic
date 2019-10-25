import { BaseStemmer } from 'node-nlp/lib/nlp/stemmers';
// With the natural stemmers we cannot customize the tokenizer
import CatalanStemmer from 'node-nlp/lib/nlp/stemmers/catalan-stemmer';
import EnglishStemmer from 'node-nlp/lib/nlp/stemmers/english-stemmer';
import SpanishStemmer from 'node-nlp/lib/nlp/stemmers/spanish-stemmer';
import PortugueseStemmer from 'node-nlp/lib/nlp/stemmers/portuguese-stemmer';
import { tokenizerPerLocale } from './tokens';

// see https://github.com/axa-group/nlp.js/blob/HEAD/docs/language-support.md
// and https://stackoverflow.com/a/11210358/145289
// snowball algorithm inspired from https://github.com/MihaiValentin/lunr-languages, based on
// https://github.com/fortnightlabs/snowball-js/blob/master/stemmer/src/ext/SpanishStemmer.js based on
// java version at http://snowball.tartarus.org/download.html
export const stemmers: { [key: string]: BaseStemmer } = {
  ca: new CatalanStemmer(tokenizerPerLocale('ca')),
  en: new EnglishStemmer(tokenizerPerLocale('en')),
  es: new SpanishStemmer(tokenizerPerLocale('es')),
  pt: new PortugueseStemmer(tokenizerPerLocale('pt'))
  //node-nlp does not support polish
};

export function stemmerFor(locale: string): BaseStemmer {
  const stem = stemmers[locale];
  if (!stem) {
    throw new Error(`No stemmer configured for locale '${locale}'`);
  }
  return stem;
}
