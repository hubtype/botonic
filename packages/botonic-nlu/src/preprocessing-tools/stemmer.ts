import {
  PorterStemmer,
  PorterStemmerEs,
  PorterStemmerFr,
  PorterStemmerIt,
  PorterStemmerNo,
  PorterStemmerPt,
  PorterStemmerRu,
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
