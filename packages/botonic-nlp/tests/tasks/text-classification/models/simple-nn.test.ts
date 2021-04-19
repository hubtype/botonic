import { createSimpleNN } from '../../../../src/tasks/text-classification/models/simple-nn'
import * as helper from '../../../helpers/constants-helper'

describe('Simple NN Model', () => {
  test('Model Creation', () => {
    const model = createSimpleNN(
      helper.MAX_SEQUENCE_LENGTH,
      helper.CLASSES.length,
      helper.EMBEDDINGS_MATRIX,
      { units: 64, dropout: 0.2, learningRate: 0.1 }
    )
    expect(model.name).toEqual('SimpleTextClassifier')
    expect(model.layers.length).toEqual(4)
  })
})
