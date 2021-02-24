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
  const inputs = input({ shape: [maxLength] })

  const embeddingsLayer = layers.embedding({
    inputDim: embeddingsMatrix.shape[0] as number,
    outputDim: embeddingsMatrix.shape[1] as number,
    inputLength: maxLength,
    weights: [embeddingsMatrix],
    trainable: true,
  })

  const dropout = layers.dropout({ rate: 0.1 })

  const bidirectionalLSTM = layers.bidirectional({
    layer: layers.lstm({
      units: 128,
      returnSequences: true,
      recurrentDropout: 0.1,
    }) as RNN,
  })

  const timeDistributedLayer = layers.timeDistributed({
    layer: layers.dense({
      units: entities.length,
      activation: 'softmax',
    }),
  })

  const outputs = timeDistributedLayer.apply(
    bidirectionalLSTM.apply(dropout.apply(embeddingsLayer.apply(inputs)))
  ) as SymbolicTensor

  const nerModel = model({ inputs, outputs })
  nerModel.compile({
    optimizer: train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['acc'],
  })
  return nerModel
}
