import {
  PorterStemmer, // eslint-disable-line import/named
  PorterStemmerEs, // eslint-disable-line import/named
  PorterStemmerFr, // eslint-disable-line import/named
  PorterStemmerIt, // eslint-disable-line import/named
  PorterStemmerNo, // eslint-disable-line import/named
  PorterStemmerPt, // eslint-disable-line import/named
  PorterStemmerRu, // eslint-disable-line import/named
} from 'natural';
import { Language } from '../language';

export class DefaultStemmer {
  stem(token: string, language: Language): string {
    switch (language) {
      case 'en':
        return PorterStemmer.stem(token);
      case 'fr':
        return PorterStemmerFr.stem(token);
      case 'it':
        return PorterStemmerIt.stem(token);
      case 'no':
        return PorterStemmerNo.stem(token);
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
