import { tensor, Tensor2D } from '@tensorflow/tfjs-node'
import { join } from 'path'

export const TEXT_CLASSIFICATION_DIR_PATH = __dirname
export const MODEL_DIR_PATH = join(TEXT_CLASSIFICATION_DIR_PATH, 'model')

export const LOCALE = 'en'
export const MAX_LENGTH = 12
export const CLASSES = ['ReturnProduct', 'BuyProduct', 'CreateOrder']
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

export const SIMPLE_NN_MODEL_NAME = 'SimpleTextClassifier'

export const EMBEDDINGS_DIMENSION = 50

export const FAKE_EMBEDDINGS_MATRIX = tensor(
  Array(VOCABULARY.length).fill(Array(EMBEDDINGS_DIMENSION).fill(1))
) as Tensor2D
