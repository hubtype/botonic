import {
  input,
  layers,
  LayersModel,
  model,
  SymbolicTensor,
  Tensor2D,
  train,
} from '@tensorflow/tfjs-node'

import { IntentClassifierParameters } from './types'

const MODEL_NAME = 'SimpleIntentClassifier'

const DEFAULT_DROPOUT = 0.3
const DEFAULT_UNITS = 128
const DEFAULT_LEARNING_RATE = 0.001

export function createSimpleNN(
  maxLength: number,
  numClasses: number,
  embeddingsMatrix: Tensor2D,
  params: IntentClassifierParameters = {
    dropout: DEFAULT_DROPOUT,
    units: DEFAULT_UNITS,
    learningRate: DEFAULT_LEARNING_RATE,
  }
): LayersModel {
  const inputs = input({ name: `${MODEL_NAME}_InputLayer`, shape: [maxLength] })

  const embeddingsLayer = layers.embedding({
    name: `${MODEL_NAME}_EmbeddingsLayer`,
    inputDim: embeddingsMatrix.shape[0],
    outputDim: embeddingsMatrix.shape[1],
    inputLength: maxLength,
    weights: [embeddingsMatrix],
    trainable: true,
  })

  const lstmLayer = layers.lstm({
    name: `${MODEL_NAME}_LSTMLayer`,
    units: params.units ?? DEFAULT_UNITS,
    dropout: params.dropout ?? DEFAULT_DROPOUT,
    recurrentDropout: 0.3,
  })

  const denseLayer = layers.dense({
    name: `${MODEL_NAME}_DenseLayer`,
    units: numClasses,
    activation: 'softmax',
  })

  const outputs = denseLayer.apply(
    lstmLayer.apply(embeddingsLayer.apply(inputs))
  ) as SymbolicTensor

  const intentClassifierModel = model({
    name: MODEL_NAME,
    inputs,
    outputs,
  })

  intentClassifierModel.compile({
    optimizer: train.adam(params.learningRate ?? DEFAULT_LEARNING_RATE),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })

  return intentClassifierModel
}
