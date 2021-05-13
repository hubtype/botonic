import { tensor, Tensor2D } from '@tensorflow/tfjs-node'
import { join } from 'path'

export const LOCALE = 'en'
export const MAX_SEQUENCE_LENGTH = 12

export const INTENTS = ['BuyProduct', 'ReturnProduct']
export const ENTITIES = ['product', 'color', 'size']

export const VOCABULARY = [
  '<PAD>',
  '<UNK>',
  'shirt',
  'not',
  'correct',
  'size',
  'i',
  'want',
  'return',
  'buy',
  'hat',
  'love',
  'brown',
  'can',
  'please',
  'hoodie',
  'a',
  'xl',
  'fit',
  'perfect',
  'l',
  'coat',
  'xs',
  'blue',
  'black',
  's',
  'm',
  'jacket',
  't-shirt',
  'white',
]

export const EMBEDDINGS_TYPE = 'glove'
export const EMBEDDINGS_DIMENSION = 50

export const EMBEDDINGS_MATRIX = tensor(
  Array(VOCABULARY.length).fill(Array(EMBEDDINGS_DIMENSION).fill(1))
) as Tensor2D

export const HELPER_DIR = __dirname
export const DATA_DIR = 'data'
export const TASKS_DIR = 'tasks'
export const MODEL_DIR = 'models'
export const NER_DIR = 'ner'
export const INTENT_CLASSIFICATION_DIR = 'intent-classification'

export const DATA_DIR_PATH = join(HELPER_DIR, 'data')

export const NER_MODEL_DIR_PATH = join(HELPER_DIR, MODEL_DIR, NER_DIR, LOCALE)

export const INTENT_CLASSIFIER_MODEL_DIR_PATH = join(
  HELPER_DIR,
  MODEL_DIR,
  INTENT_CLASSIFICATION_DIR,
  LOCALE
)
