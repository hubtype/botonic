import {
  input,
  layers,
  LayersModel,
  model,
  RNN,
  SymbolicTensor,
  Tensor2D,
  train,
} from '@tensorflow/tfjs-node'

import { NerModelParameters } from './types'

const DEFAULT_DROPOUT = 0.1
const DEFAULT_UNITS = 128
const DEFAULT_LEARNING_RATE = 0.001

export function createBiLstmModel(
  maxLength: number,
  entities: string[],
  embeddingsMatrix: Tensor2D,
  params: NerModelParameters = {
    dropout: DEFAULT_DROPOUT,
    units: DEFAULT_UNITS,
    learningRate: DEFAULT_LEARNING_RATE,
  }
): LayersModel {
  const inputs = input({ name: 'InputLayer', shape: [maxLength] })

  const embeddingsLayer = layers.embedding({
    name: 'EmbeddingsLayer',
    inputDim: embeddingsMatrix.shape[0] as number,
    outputDim: embeddingsMatrix.shape[1] as number,
    inputLength: maxLength,
    weights: [embeddingsMatrix],
    trainable: true,
  })

  const dropoutLayer = layers.dropout({
    name: 'DropoutLayer',
    rate: params.dropout ?? DEFAULT_DROPOUT,
  })

  const bidirectionalLSTM = layers.bidirectional({
    name: 'BidirectionalLayer',
    layer: layers.lstm({
      units: params.units ?? DEFAULT_UNITS,
      returnSequences: true,
      recurrentDropout: 0.1,
    }) as RNN,
  })

  const timeDistributedLayer = layers.timeDistributed({
    name: 'TimeDistributedLayer',
    layer: layers.dense({
      units: entities.length,
      activation: 'softmax',
    }),
  })

  const outputs = timeDistributedLayer.apply(
    bidirectionalLSTM.apply(dropoutLayer.apply(embeddingsLayer.apply(inputs)))
  ) as SymbolicTensor

  const nerModel = model({ name: 'BiLstmNerModel', inputs, outputs })
  nerModel.compile({
    optimizer: train.adam(params.learningRate ?? DEFAULT_LEARNING_RATE),
    loss: 'categoricalCrossentropy',
    metrics: ['acc'],
  })
  return nerModel
}
