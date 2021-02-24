/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Normalizer,
  PreprocessEngines,
  Stemmer,
  Stopwords,
  Tokenizer,
} from '../preprocess/types'
import { Locale } from '../types'

export class BotonicTaskTemplate {
  protected preprocessEngines: PreprocessEngines = {}

  constructor(
    public readonly locale: Locale,
    public readonly maxLength: number
  ) {
    this.loadEngine('normalizer')
    this.loadEngine('tokenizer')
    this.loadEngine('stopwords')
    //   this.loadEngine('stemmer')
  }

  private loadEngine(engineType: string) {
    try {
      const engine = require(`../preprocess/engines/${this.locale}/${engineType}-${this.locale}`)
        .default
      this.preprocessEngines[engineType] =
        engineType == 'stopwords' ? engine.stopwords : new engine()
    } catch {
      //TODO: display that default engine is going to be used in a more efficient way.
      console.warn(
        `Engine "${engineType}" not implemented for locale "${this.locale}". Using default.`
      )
    }
  }

  set normalizer(engine: Normalizer) {
    this.preprocessEngines.normalizer = engine
  }

  set tokenizer(engine: Tokenizer) {
    this.preprocessEngines.tokenizer = engine
  }

  set stopwords(engine: Stopwords) {
    this.preprocessEngines.stopwords = engine
  }

  get stopwords(): string[] {
    return this.preprocessEngines.stopwords
  }

  set stemmer(engine: Stemmer) {
    this.preprocessEngines.stemmer = engine
  }
}
