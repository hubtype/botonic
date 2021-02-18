/* eslint-disable @typescript-eslint/no-var-requires */
import { Sample } from '../parser/types'
import { Locale } from '../types'
import { UNKOWN_TOKEN } from './constants'
import { stopwordsEn } from './engines/en/stopwords-en'
import { stopwordsEs } from './engines/es/stopwords-es'
import { Normalizer, SequencePosition, Stemmer, Tokenizer } from './types'

export class Preprocessor {
  private normalizer: Normalizer
  private stemmer: Stemmer
  private tokenizer: Tokenizer
  stopwords: string[]

  constructor(
    readonly locale: Locale,
    readonly maxLength: number,
    normalizer?: Normalizer,
    stemmer?: Stemmer,
    tokenizer?: Tokenizer,
    stopwords?: string[]
  ) {
    this.loadEngine('normalizer', normalizer)
    this.loadEngine('stemmer', stemmer)
    this.loadEngine('tokenizer', tokenizer)
    this.loadStopwords(stopwords)
  }

  private loadEngine(
    engineName: string,
    engine?: Normalizer | Stemmer | Tokenizer
  ) {
    if (engine) {
      this[engineName] = engine
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const LocaleEngine = require(`./engines/${this.locale}/${engineName}-${this.locale}`)
          .default
        this[engineName] = new LocaleEngine()
      } catch {
        throw new Error(
          `The selected locale "${this.locale}" has no ${engineName} implementation.`
        )
      }
    }
  }

  private loadStopwords(stopwords?: string[]) {
    if (stopwords) {
      this.stopwords = stopwords.map(word => this.normalizer.normalize(word))
    } else {
      switch (this.locale) {
        case 'en':
          this.stopwords = stopwordsEn.map(word =>
            this.normalizer.normalize(word)
          )
          break
        case 'es':
          this.stopwords = stopwordsEs.map(word =>
            this.normalizer.normalize(word)
          )
          break
        default:
          throw new Error(
            `The selected locale "${this.locale}" has no stopwords defined.`
          )
      }
    }
  }

  trainTestSplit(
    samples: Sample[],
    testSize: number,
    shuffle = true
  ): { train: Sample[]; test: Sample[] } {
    if (1 < testSize || testSize < 0) {
      throw new RangeError(`testsize must be a number between 0 and 1.`)
    }
    if (shuffle) {
      samples = samples.sort(() => Math.random() - 0.5)
    }
    return {
      train: samples.slice(testSize * samples.length),
      test: samples.slice(0, testSize * samples.length),
    }
  }

  generateVocabulary(samples: Sample[]): string[] {
    let allTokens: string[] = []
    samples.forEach(
      sample => (allTokens = allTokens.concat(this.preprocessText(sample.text)))
    )
    return Array.from(new Set(allTokens))
  }

  private preprocessText(text: string): string[] {
    return this.tokenizer
      .tokenize(this.normalizer.normalize(text))
      .filter(token => !this.stopwords.includes(token))
      .map(token => this.stemmer.stem(token))
  }

  protected paddSequence(
    sequence: string[],
    value: string,
    position: SequencePosition
  ): string[] {
    const difference = this.maxLength - sequence.length
    if (difference > 0) {
      const padd = Array(difference).fill(value)
      if (position == 'pre') {
        return padd.concat(sequence)
      } else if (position == 'post') {
        return sequence.concat(padd)
      } else {
        throw new Error(`Invalid sequence position "${position}"`)
      }
    } else {
      return sequence
    }
  }

  protected truncateSequence(
    sequence: string[],
    position: SequencePosition
  ): string[] {
    if (position == 'pre') {
      return sequence.slice(-this.maxLength)
    } else if (position == 'post') {
      return sequence.slice(0, this.maxLength)
    } else {
      throw new Error(`Invalid sequence position "${position}"`)
    }
  }

  protected encodeSequence(
    sequence: string[],
    vocabulary: string[],
    allowUnknown: boolean
  ): number[] {
    return sequence.map(item => {
      let code = vocabulary.indexOf(item)
      if (code === -1) {
        if (allowUnknown) {
          code = vocabulary.indexOf(UNKOWN_TOKEN)
        } else {
          throw new Error(`"${item}" is not included in the given dictionary.`)
        }
      }
      return code
    })
  }

  protected toCategorical(sequence: number[], numClasses: number): number[][] {
    return sequence.map(i => {
      const categoricalEntity = Array(numClasses).fill(0)
      categoricalEntity[i] = 1
      return categoricalEntity
    })
  }
}
