import {
  input,
  layers,
  LayersModel,
  model,
  SymbolicTensor,
  Tensor2D,
  train,
} from '@tensorflow/tfjs-node'

import {
  DEFAULT_DROPOUT,
  DEFAULT_LEARNING_RATE,
  DEFAULT_UNITS,
} from './constants'
import { TextClassifierParameters } from './types'

export function createSimpleNN(
  maxLength: number,
  intents: string[],
  embeddingsMatrix: Tensor2D,
  params: TextClassifierParameters = {
    dropout: DEFAULT_DROPOUT,
    units: DEFAULT_UNITS,
    learningRate: DEFAULT_LEARNING_RATE,
  }
): LayersModel {
  const inputs = input({ name: 'InputLayer', shape: [maxLength] })

  const embeddingsLayer = layers.embedding({
    name: 'EmbeddingsLayer',
    inputDim: embeddingsMatrix.shape[0],
    outputDim: embeddingsMatrix.shape[1],
    inputLength: maxLength,
    weights: [embeddingsMatrix],
    trainable: true,
  })

  const lstmLayer = layers.lstm({
    name: 'LSTMLayer',
    units: params.units ?? DEFAULT_UNITS,
    dropout: params.dropout ?? DEFAULT_DROPOUT,
    recurrentDropout: 0.3,
  })

  const denseLayer = layers.dense({
    name: 'DenseLayer',
    units: intents.length,
    activation: 'softmax',
  })

  const outputs = denseLayer.apply(
    lstmLayer.apply(embeddingsLayer.apply(inputs))
  ) as SymbolicTensor

  const textClassifierModel = model({
    name: 'SimpleTextClassifier',
    inputs,
    outputs,
  })

  textClassifierModel.compile({
    optimizer: train.adam(params.learningRate ?? DEFAULT_LEARNING_RATE),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })

  return textClassifierModel
}
