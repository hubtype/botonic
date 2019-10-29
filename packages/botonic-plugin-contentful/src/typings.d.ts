declare module 'node-nlp/lib/util' {
  export interface WordPosition {
    start: number
    end: number
    len: number
  }

  export interface BestSubstringResult {
    start: number
    /** end is INCLUSIVE */
    end: number
    len: number
    levenshtein: number
    accuracy: number
  }

  export class SimilarSearch {
    constructor(settings: { normalize: boolean })

    getWordPositions(str: string): WordPosition[]

    getSimilarity(str1: string, str2: string): number

    getBestSubstringList(
      str1: string,
      str2: string,
      words1: WordPosition[] | undefined,
      threshold: number
    ): BestSubstringResult[]
  }
}

declare module 'node-nlp/lib/nlp/tokenizers' {
  export class Tokenizer {
    tokenize(text: string, normalize: boolean): string[]
  }
}

declare module 'node-nlp/lib/nlp/stemmers' {
  export class BaseStemmer {
    tokenizeAndStem(str: string, keepStops: boolean): string[]
  }
}

declare module 'node-nlp/lib/nlp/nlp-util' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'
  import { BaseStemmer } from 'node-nlp/lib/nlp/stemmers'

  class NlpUtil {
    static getStemmer(locale: string): BaseStemmer

    static getTokenizer(locale: string): Tokenizer
  }

  export = NlpUtil
}

declare module 'node-nlp/lib/nlp/tokenizers/punct-tokenizer' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'

  class PunctTokenizer extends Tokenizer {}

  export = PunctTokenizer
}

declare module 'node-nlp/lib/nlp/tokenizers/aggressive-tokenizer-en' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'

  class AggressiveTokenizerEn extends Tokenizer {}

  export = AggressiveTokenizerEn
}

declare module 'node-nlp/lib/nlp/tokenizers/aggressive-tokenizer-es' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'

  class AggressiveTokenizerEs extends Tokenizer {
    trim(arr: string[]): string[]
  }

  export = AggressiveTokenizerEs
}

declare module 'node-nlp/lib/nlp/tokenizers/aggressive-tokenizer-pt' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'

  class AggressiveTokenizerPt extends Tokenizer {}

  export = AggressiveTokenizerPt
}

// We use directly the ES Stemmer instead of using NlpUtil to avoid loading dependencies of so many languages
// (there are evn errors with 'fs' library and with Japanese dependencies)

declare module 'node-nlp/lib/nlp/stemmers/catalan-stemmer' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'

  class CatalanStemmer {
    constructor(tokenizer: Tokenizer)

    tokenizeAndStem(str: string, keepStops: boolean): string[]
  }

  export = CatalanStemmer
}

declare module 'node-nlp/lib/nlp/stemmers/spanish-stemmer' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'

  class SpanishStemmer {
    constructor(tokenizer: Tokenizer)

    tokenizeAndStem(str: string, keepStops: boolean): string[]
  }

  export = SpanishStemmer
}

declare module 'node-nlp/lib/nlp/stemmers/english-stemmer' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'
  class EnglishStemmer {
    constructor(tokenizer: Tokenizer)
    tokenizeAndStem(str: string, keepStops: boolean): string[]
  }

  export = EnglishStemmer
}

declare module 'node-nlp/lib/nlp/stemmers/portuguese-stemmer' {
  import { Tokenizer } from 'node-nlp/lib/nlp/tokenizers'
  class PortugueseStemmer {
    constructor(tokenizer: Tokenizer)
    tokenizeAndStem(str: string, keepStops: boolean): string[]
  }

  export = PortugueseStemmer
}
