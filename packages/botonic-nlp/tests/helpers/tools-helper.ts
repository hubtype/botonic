import { Dataset } from '../../src/dataset/dataset'
import { EmbeddingsDimension } from '../../src/embeddings/database/types'
import { WordEmbeddingStorage } from '../../src/embeddings/types'
import { IndexedItems } from '../../src/encode/indexed-items'
import { LabelEncoder } from '../../src/encode/label-encoder'
import { OneHotEncoder } from '../../src/encode/one-hot-encoder'
import { Preprocessor } from '../../src/preprocess'
import { NEUTRAL_ENTITY } from '../../src/tasks/ner/process/constants'
import { Processor as NerProcessor } from '../../src/tasks/ner/process/processor'
import {
  DATA_DIR_PATH,
  EMBEDDINGS_DIMENSION,
  ENTITIES,
  INTENTS,
  LOCALE,
  MAX_SEQUENCE_LENGTH,
  VOCABULARY,
} from './constants-helper'

export const dataset = Dataset.load(DATA_DIR_PATH)

export const preprocessor = new Preprocessor(LOCALE, MAX_SEQUENCE_LENGTH)

export const tokenEncoder = new LabelEncoder(new IndexedItems(VOCABULARY))
export const intentEncoder = new OneHotEncoder(new IndexedItems(INTENTS))
export const entitiesEncoder = new OneHotEncoder(
  new IndexedItems([NEUTRAL_ENTITY].concat(ENTITIES))
)

export const nerProcessor = new NerProcessor(
  preprocessor,
  tokenEncoder,
  entitiesEncoder
)

class TestWordEmbeddingStorage implements WordEmbeddingStorage {
  constructor(readonly dimension: EmbeddingsDimension) {}

  async getWordEmbedding(word: string): Promise<number[]> {
    return Array(this.dimension).fill(Math.random() * 2 - 1)
  }
}

export const wordEmbeddingStorage = new TestWordEmbeddingStorage(
  EMBEDDINGS_DIMENSION
)
