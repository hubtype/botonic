import { tensor, Tensor2D } from '@tensorflow/tfjs-node'
import { join } from 'path'

export const TEXT_CLASSIFICATION_DIR_PATH = __dirname
export const MODEL_DIR_PATH = join(TEXT_CLASSIFICATION_DIR_PATH, 'model')

export const LOCALE = 'en'
export const MAX_LENGTH = 12
export const VOCABULARY = ['<PAD>', '<UNK>', 'this', 'is', 'a', 'test']
export const CLASSES = ['ReturnProduct', 'BuyProduct', 'CreateOrder']

export const SIMPLE_NN_MODEL_NAME = 'SimpleTextClassifier'

export const EMBEDDINGS_TYPE = 'glove'
export const EMBEDDINGS_DIMENSION = 50

export const FAKE_EMBEDDINGS_MATRIX = tensor([
  Array(50).fill(1),
  Array(50).fill(1),
  Array(50).fill(1),
  Array(50).fill(1),
]) as Tensor2D
