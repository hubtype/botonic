import { join } from 'path'

import { DatabaseManager } from '../../../../src/embeddings/database/manager'
import {
  EmbeddingsDimension,
  EmbeddingsType,
} from '../../../../src/embeddings/database/types'
import { Embedder } from '../../../../src/embeddings/embedder'
import { DataLoader } from '../../../../src/loaders/data-loader'
import { Codifier } from '../../../../src/preprocess/codifier'
import { Preprocessor } from '../../../../src/preprocess/preprocessor'
import { Locale } from '../../../../src/types'
import { SHOPPING_DATA_PATH } from '../../helper'

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

export const MODEL_DIR_PATH = join(__dirname, 'model')

export const sequenceCodifier = new Codifier(VOCABULARY, false)
export const entitiesCodifier = new Codifier(ENTITIES, true)

export const preprocessor = new Preprocessor(LOCALE, MAX_LENGTH)

export const dataLoader = new DataLoader(SHOPPING_DATA_PATH)

export async function getDatabaseManager(): Promise<DatabaseManager> {
  return await DatabaseManager.with(
    LOCALE,
    EMBEDDINGS_TYPE,
    EMBEDDINGS_DIMENSION
  )
}

export async function getEmbedder(): Promise<Embedder> {
  return new Embedder(await getDatabaseManager())
}
