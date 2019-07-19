import { BaseStemmer } from 'node-nlp/lib/nlp/stemmers';
import { Locale } from './index';
// porter stemmers are simpler than the other ones, but they are the default in node-nlp. Why?
import CatalanStemmer from 'node-nlp/lib/nlp/stemmers/catalan-stemmer';
import stemmerEn from 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer';
import stemmerEs from 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer-es';
import stemmerPt from 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer-pt';
import PunctTokenizer = require('node-nlp/lib/nlp/tokenizers/punct-tokenizer');

const catalanStemmer = new CatalanStemmer(new PunctTokenizer());
export const stemmers: { [key: string]: BaseStemmer } = {
  ca: catalanStemmer,
  en: stemmerEn,
  es: stemmerEs,
  pr: stemmerPt
  //node-nlp does not support polish
};

export function stemmerFor(locale: Locale): BaseStemmer {
  let stem = stemmers[locale];
  if (!stem) {
    throw new Error(`No stemmer configured for locale '${locale}'`);
  }
  return stem;
}
