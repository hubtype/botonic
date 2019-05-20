declare module 'node-nlp/lib/nlp/stemmers' {
  export class BaseStemmer {
    tokenizeAndStem(str: string, keepStops: boolean): string[];
  }
}

declare module 'node-nlp/lib/nlp/nlp-util' {
  import { BaseStemmer } from 'node-nlp/lib/nlp/stemmers';
  class NlpUtil {
    static getStemmer(locale: string): BaseStemmer;
  }
  export = NlpUtil;
}

// We use directly the ES Stemmer instead of using NlpUtil to avoid loading dependencies of so many languages
// (there are evn errors with 'fs' library and with Japanese dependencies)
declare module 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer-es' {
  class PorterStemmer {
    tokenizeAndStem(str: string, keepStops: boolean): string[];
  }
  const stemmer: PorterStemmer;
  export = stemmer;
}
