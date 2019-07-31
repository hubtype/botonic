declare module 'node-nlp/lib/nlp/tokenizers' {
  export class Tokenizer {
    tokenize(text: string): string[];
  }
}
declare module 'node-nlp/lib/nlp/stemmers' {
  export class BaseStemmer {
    tokenizeAndStem(str: string, keepStops: boolean): string[];
  }
}

declare module 'node-nlp/lib/nlp/nlp-util' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers';
  import { BaseStemmer } from 'node-nlp/lib/nlp/stemmers';
  class NlpUtil {
    static getStemmer(locale: string): BaseStemmer;
    static getTokenizer(locale: string): Tokenizer;
  }

  export = NlpUtil;
}
declare module 'node-nlp/lib/nlp/tokenizers/punct-tokenizer' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers';

  class PunctTokenizer extends Tokenizer {}
  export = PunctTokenizer;
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

declare module 'node-nlp/lib/nlp/stemmers/catalan-stemmer' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers';

  class CatalanStemmer {
    constructor(tokenizer: Tokenizer);
    tokenizeAndStem(str: string, keepStops: boolean): string[];
  }
  export = CatalanStemmer;
}

declare module 'node-nlp/lib/nlp/stemmers/spanish-stemmer' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers';

  class SpanishStemmer {
    constructor(tokenizer: Tokenizer);
    tokenizeAndStem(str: string, keepStops: boolean): string[];
  }
  export = SpanishStemmer;
}

declare module 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer' {
  class PorterStemmer {
    tokenizeAndStem(str: string, keepStops: boolean): string[];
  }
  const stemmer: PorterStemmer;
  export = stemmer;
}

declare module 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer-pt' {
  class PorterStemmer {
    tokenizeAndStem(str: string, keepStops: boolean): string[];
  }
  const stemmer: PorterStemmer;
  export = stemmer;
}
