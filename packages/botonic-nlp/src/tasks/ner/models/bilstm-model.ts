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

export function createBiLstmModel(
  maxLength: number,
  entities: string[],
  embeddingsMatrix: Tensor2D
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

  const dropout = layers.dropout({ name: 'DropoutLayer', rate: 0.1 })

  const bidirectionalLSTM = layers.bidirectional({
    name: 'BidirectionalLayer',
    layer: layers.lstm({
      units: 128,
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
    bidirectionalLSTM.apply(dropout.apply(embeddingsLayer.apply(inputs)))
  ) as SymbolicTensor

  const nerModel = model({ name: 'BiLstmNerModel', inputs, outputs })
  nerModel.compile({
    optimizer: train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['acc'],
  })
  return nerModel
}
