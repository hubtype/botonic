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

declare module '@nlpjs/core/src/tokenizer' {
  class Tokenizer {
    tokenize(text: string, normalize: boolean): string[]
  }
  export = Tokenizer
}

declare module '@nlpjs/core/src/stemmer' {
  class Stemmer {
    stem(tokens: string[]): string[]
  }
  export = Stemmer
}

declare module '@nlpjs/core/src/base-stemmer' {
  import Stemmer from '@nlpjs/core/src/stemmer'
  class BaseStemmer extends Stemmer {
    stem(tokens: string[]): string[]
  }
  export = BaseStemmer
}

declare module '@nlpjs/lang-en-min/src/stemmer-en' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerEn extends BaseStemmer {}
  export = StemmerEn
}

declare module '@nlpjs/lang-en-min/src/tokenizer-en' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerEn extends Tokenizer {}

  export = TokenizerEn
}

declare module '@nlpjs/lang-es/src/stemmer-es' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerEs extends BaseStemmer {}
  export = StemmerEs
}

declare module '@nlpjs/lang-es/src/tokenizer-es' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerEs extends Tokenizer {}
  export = TokenizerEs
}

declare module '@nlpjs/lang-pt/src/stemmer-pt' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerPt extends BaseStemmer {}
  export = StemmerPt
}

declare module '@nlpjs/lang-pt/src/tokenizer-pt' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerPt extends Tokenizer {}
  export = TokenizerPt
}

declare module '@nlpjs/lang-ca/src/stemmer-ca' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerCa extends BaseStemmer {}
  export = StemmerCa
}

declare module '@nlpjs/lang-pl/src/stemmer-pl' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerPl extends BaseStemmer {}
  export = StemmerPl
}

declare module '@nlpjs/lang-pl/src/tokenizer-pl' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerPl extends Tokenizer {}
  export = TokenizerPl
}

declare module '@nlpjs/lang-ru/src/stemmer-ru' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerRu extends BaseStemmer {}
  export = StemmerRu
}

declare module '@nlpjs/lang-ru/src/tokenizer-ru' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerRu extends Tokenizer {}
  export = TokenizerRu
}

declare module '@nlpjs/lang-tr/src/stemmer-tr' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerTr extends BaseStemmer {}
  export = StemmerTr
}

declare module '@nlpjs/lang-tr/src/tokenizer-tr' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerTr extends Tokenizer {}
  export = TokenizerTr
}

declare module '@nlpjs/lang-it/src/tokenizer-it' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerIt extends Tokenizer {}
  export = TokenizerIt
}

declare module '@nlpjs/lang-it/src/stemmer-it' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerIt extends BaseStemmer {}
  export = StemmerIt
}

declare module '@nlpjs/lang-fr/src/tokenizer-fr' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerFr extends Tokenizer {}
  export = TokenizerFr
}

declare module '@nlpjs/lang-fr/src/stemmer-fr' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerFr extends BaseStemmer {}
  export = StemmerFr
}

declare module '@nlpjs/lang-de/src/tokenizer-de' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerDe extends Tokenizer {}
  export = TokenizerDe
}

declare module '@nlpjs/lang-de/src/stemmer-de' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerDe extends BaseStemmer {}
  export = StemmerDe
}

declare module '@nlpjs/lang-ro/src/tokenizer-ro' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerRo extends Tokenizer {}
  export = TokenizerRo
}

declare module '@nlpjs/lang-ro/src/stemmer-ro' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerRo extends BaseStemmer {}
  export = StemmerRo
}

declare module '@nlpjs/lang-el/src/tokenizer-el' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerEl extends Tokenizer {}
  export = TokenizerEl
}

declare module '@nlpjs/lang-el/src/stemmer-el' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerEl extends BaseStemmer {}
  export = StemmerEl
}

declare module '@nlpjs/lang-cs/src/tokenizer-cs' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerCs extends Tokenizer {}
  export = TokenizerCs
}

declare module '@nlpjs/lang-cs/src/stemmer-cs' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerCs extends BaseStemmer {}
  export = StemmerCs
}

declare module '@nlpjs/lang-uk/src/tokenizer-uk' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerUk extends Tokenizer {}
  export = TokenizerUk
}

declare module '@nlpjs/lang-sl/src/tokenizer-sl' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerSl extends Tokenizer {}
  export = TokenizerSl
}

declare module '@nlpjs/lang-sl/src/stemmer-sl' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerSl extends BaseStemmer {}
  export = StemmerSl
}

declare module '@nlpjs/lang-hu/src/tokenizer-hu' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerHu extends Tokenizer {}
  export = TokenizerHu
}

declare module '@nlpjs/lang-hu/src/stemmer-hu' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerHu extends BaseStemmer {}
  export = StemmerHu
}

declare module '@nlpjs/lang-nl/src/tokenizer-nl' {
  import Tokenizer from '@nlpjs/core/src/tokenizer'

  class TokenizerNl extends Tokenizer {}
  export = TokenizerNl
}

declare module '@nlpjs/lang-nl/src/stemmer-nl' {
  import BaseStemmer from '@nlpjs/core/src/base-stemmer'

  class StemmerNl extends BaseStemmer {}
  export = StemmerNl
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
