import { join } from 'path'

import { DatasetLoader } from '../../../../src/dataset/loader'
import {
  EmbeddingsDimension,
  EmbeddingsType,
} from '../../../../src/embeddings/database/types'
import { WordEmbeddingStorage } from '../../../../src/embeddings/types'
import { LabelEncoder } from '../../../../src/encode/label-encoder'
import { OneHotEncoder } from '../../../../src/encode/one-hot-encoder'
import { Preprocessor } from '../../../../src/preprocess/preprocessor'
import { Locale } from '../../../../src/types'
import { SHOPPING_DATA_PATH } from '../../constants-helper'
export { EMBEDDINGS_MATRIX } from './embeddings-matrix'

export const LOCALE: Locale = 'en'

export const MAX_SEQUENCE_LENGTH = 12

export const MODEL_NAME = 'BiLstmNerModel'

export const VOCABULARY = [
  '<PAD>',
  '<UNK>',
  'i',
  'looking',
  'a',
  'size',
  'xxs',
  'wool',
  'belts',
  'xs',
  'hate',
  'gray',
  'linen',
  'hat',
  'hoodie',
  'm',
  '?',
  'jacket',
  's',
  'blue',
  'leather',
  'pink',
  't-shirt',
  'fur',
  'cotton',
  'xl',
  'shirt',
  'l',
  'love',
  '.',
  'xxl',
  'red',
  'can',
  'someone',
  'tell',
  'where',
  'buy',
  'want',
  'return',
  'not',
  'white',
  'orange',
  'sale',
  'brown',
  'allergic',
  'black',
  'material',
  'jeans',
  'understand',
  'people',
  'coats',
  'clothes',
  'new',
  'trousers',
  'who',
  'wears',
  'coat',
]

export const ENTITIES = ['O', 'product', 'color', 'material', 'size']

export const DATASET = DatasetLoader.load(SHOPPING_DATA_PATH)

export const EMBEDDINGS_TYPE: EmbeddingsType = 'glove'
export const EMBEDDINGS_DIMENSION: EmbeddingsDimension = 50

export const MODEL_DIR_PATH = join(__dirname, 'model')

export const sequenceCodifier = new LabelEncoder(VOCABULARY)
export const entitiesCodifier = new OneHotEncoder(ENTITIES)

export const preprocessor = new Preprocessor(LOCALE, MAX_SEQUENCE_LENGTH)

class TestWordEmbeddingStorage implements WordEmbeddingStorage {
  constructor(readonly dimension: EmbeddingsDimension) {}

  async getWordEmbedding(word: string): Promise<number[]> {
    return Array(this.dimension).fill(Math.random() * 2 - 1)
  }
}

export const testWordEmbeddingStorage = new TestWordEmbeddingStorage(
  EMBEDDINGS_DIMENSION
)
