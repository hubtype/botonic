// TODO: atm not using stemmers (returning default) as it will decrease accuracy with W.Embeddings
// eslint-disable-next-line
import * as PorterStemmer from 'natural/lib/natural/stemmers/porter_stemmer';
// eslint-disable-next-line
import * as PorterStemmerEs from 'natural/lib/natural/stemmers/porter_stemmer_es';
// eslint-disable-next-line
import * as PorterStemmerFr from 'natural/lib/natural/stemmers/porter_stemmer_fr';
// eslint-disable-next-line
import * as PorterStemmerIt from 'natural/lib/natural/stemmers/porter_stemmer_it';
// eslint-disable-next-line
import * as PorterStemmerPt from 'natural/lib/natural/stemmers/porter_stemmer_pt';
// eslint-disable-next-line
import * as PorterStemmerRu from 'natural/lib/natural/stemmers/porter_stemmer_ru';
import { Language } from '../language';

export class DefaultStemmer {
  private _active: boolean;
  constructor(active = false) {
    this._active = active;
  }
  stem(token: string, language: Language): string {
    if (!this._active) return token;
    switch (language) {
      case 'en':
        return PorterStemmer.stem(token);
      case 'fr':
        return PorterStemmerFr.stem(token);
      case 'it':
        return PorterStemmerIt.stem(token);
      case 'es':
        return PorterStemmerEs.stem(token);
      case 'pt':
        return PorterStemmerPt.stem(token);
      case 'ru':
        return PorterStemmerRu.stem(token);
      default:
        return token;
    }
  }
}
