declare module '@nlpjs/similarity/src' {
  function leven(left: string, right: string): number
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

declare module '@nlpjs/lang-en/src' {
  import { BaseStemmer, Tokenizer } from '@nlpjs/core/src'

  export class TokenizerEn extends Tokenizer {}

  export class StemmerEn extends BaseStemmer {}
}

declare module '@nlpjs/lang-es/src' {
  import { BaseStemmer, Tokenizer } from '@nlpjs/core/src'

  export class TokenizerEs extends Tokenizer {}

  export class StemmerEs extends BaseStemmer {}
}

declare module '@nlpjs/lang-pt/src' {
  import { BaseStemmer, Tokenizer } from '@nlpjs/core/src'

  export class TokenizerPt extends Tokenizer {}

  export class StemmerPt extends BaseStemmer {}
}

declare module '@nlpjs/lang-ca/src' {
  import { BaseStemmer } from '@nlpjs/core/src'

  export class StemmerCa extends BaseStemmer {}
}
