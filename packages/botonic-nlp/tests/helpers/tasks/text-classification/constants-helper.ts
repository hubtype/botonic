import { tensor, Tensor2D } from '@tensorflow/tfjs-node'

export const MAX_LENGTH = 12
export const CLASSES = ['ReturnProduct', 'BuyProduct', 'CreateOrder']

export const SIMPLE_NN_MODEL_NAME = 'SimpleTextClassifier'

export const FAKE_EMBEDDINGS_MATRIX = tensor([
  Array(50).fill(1),
  Array(50).fill(1),
  Array(50).fill(1),
  Array(50).fill(1),
]) as Tensor2D
