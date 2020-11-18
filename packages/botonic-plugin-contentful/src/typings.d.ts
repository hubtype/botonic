/* eslint-disable import/no-duplicates */
declare module '@nlpjs/similarity/src' {
  export function leven(left: string, right: string): number
}

declare module '@nlpjs/ner/src' {
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

  export class ExtractorEnum {
    constructor()

    getWordPositions(str: string): WordPosition[]

    getBestSubstringList(
      str1: string,
      str2: string,
      words1: WordPosition[] | undefined,
      threshold: number
    ): BestSubstringResult[]
  }
}

declare module '@nlpjs/core/src' {
  export class Tokenizer {
    tokenize(text: string, normalize: boolean): string[]
  }
  export class Stemmer {
    stem(tokens: string[]): string[]
  }

  export class BaseStemmer extends Stemmer {
    stem(tokens: string[]): string[]
  }
}

declare module '@nlpjs/lang-en-min/src/stemmer-en' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerEn extends BaseStemmer {}
  export = StemmerEn
}

declare module '@nlpjs/lang-en-min/src/tokenizer-en' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerEn extends Tokenizer {}

  export = TokenizerEn
}

declare module '@nlpjs/lang-es/src/stemmer-es' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerEs extends BaseStemmer {}
  export = StemmerEs
}

declare module '@nlpjs/lang-es/src/tokenizer-es' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerEs extends Tokenizer {}
  export = TokenizerEs
}

declare module '@nlpjs/lang-pt/src/stemmer-pt' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerPt extends BaseStemmer {}
  export = StemmerPt
}

declare module '@nlpjs/lang-pt/src/tokenizer-pt' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerPt extends Tokenizer {}
  export = TokenizerPt
}

declare module '@nlpjs/lang-ca/src/stemmer-ca' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerCa extends BaseStemmer {}
  export = StemmerCa
}

declare module '@nlpjs/lang-pl/src/stemmer-pl' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerPl extends BaseStemmer {}
  export = StemmerPl
}

declare module '@nlpjs/lang-pl/src/tokenizer-pl' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerPl extends Tokenizer {}
  export = TokenizerPl
}

declare module '@nlpjs/lang-ru/src/stemmer-ru' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerRu extends BaseStemmer {}
  export = StemmerRu
}

declare module '@nlpjs/lang-ru/src/tokenizer-ru' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerRu extends Tokenizer {}
  export = TokenizerRu
}

declare module '@nlpjs/lang-tr/src/stemmer-tr' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerTr extends BaseStemmer {}
  export = StemmerTr
}

declare module '@nlpjs/lang-tr/src/tokenizer-tr' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerTr extends Tokenizer {}
  export = TokenizerTr
}

declare module '@nlpjs/lang-it/src/tokenizer-it' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerIt extends Tokenizer {}
  export = TokenizerIt
}

declare module '@nlpjs/lang-it/src/stemmer-it' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerIt extends BaseStemmer {}
  export = StemmerIt
}

declare module '@nlpjs/lang-fr/src/tokenizer-fr' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerFr extends Tokenizer {}
  export = TokenizerFr
}

declare module '@nlpjs/lang-fr/src/stemmer-fr' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerFr extends BaseStemmer {}
  export = StemmerFr
}

declare module '@nlpjs/lang-de/src/tokenizer-de' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerDe extends Tokenizer {}
  export = TokenizerDe
}

declare module '@nlpjs/lang-de/src/stemmer-de' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerDe extends BaseStemmer {}
  export = StemmerDe
}

declare module '@nlpjs/lang-ro/src/tokenizer-ro' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerRo extends Tokenizer {}
  export = TokenizerRo
}

declare module '@nlpjs/lang-ro/src/stemmer-ro' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerRo extends BaseStemmer {}
  export = StemmerRo
}

declare module '@nlpjs/lang-el/src/tokenizer-el' {
  import { Tokenizer } from '@nlpjs/core/src'

  class TokenizerEl extends Tokenizer {}
  export = TokenizerEl
}

declare module '@nlpjs/lang-el/src/stemmer-el' {
  import { BaseStemmer } from '@nlpjs/core/src'

  class StemmerEl extends BaseStemmer {}
  export = StemmerEl
}

declare module 'sort-stream' {
  function sort(func: (a: any, b: any) => number): any
  export = sort
}

declare namespace jest {
  interface Expect {
    <T = any>(actual: T, message?: string): JestMatchers<T>
  }
}

declare module 'contentful-import/dist/utils/schema' {
  import { ObjectSchema } from 'joi'
  const exports: { payloadSchema: ObjectSchema }
  export = exports
}
