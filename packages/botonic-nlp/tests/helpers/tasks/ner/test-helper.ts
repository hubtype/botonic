import { join } from 'path'

import { DatabaseManager } from '../../../../src/embeddings/database-manager'
import {
  EmbeddingsDimension,
  EmbeddingsType,
} from '../../../../src/embeddings/types'
import { DataLoader } from '../../../../src/loaders/data-loader'
import { Codifier } from '../../../../src/preprocess/codifier'
import { Preprocessor } from '../../../../src/preprocess/preprocessor'
import { Locale } from '../../../../src/types'

export const LOCALE: Locale = 'en'

export const MAX_LENGTH = 12

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

export const EMBEDDINGS_TYPE: EmbeddingsType = 'glove'
export const EMBEDDINGS_DIMENSION: EmbeddingsDimension = 50

const SHOPPING_PATH = join(__dirname, '..', '..', 'data', 'shopping.yaml')

export const sequenceCodifier = new Codifier(VOCABULARY, false)
export const entitiesCodifier = new Codifier(ENTITIES, true)

export const preprocessor = new Preprocessor(LOCALE, MAX_LENGTH)

export const dataLoader = new DataLoader(SHOPPING_PATH)
export const databaseManager = new DatabaseManager(
  LOCALE,
  EMBEDDINGS_TYPE,
  EMBEDDINGS_DIMENSION
)
