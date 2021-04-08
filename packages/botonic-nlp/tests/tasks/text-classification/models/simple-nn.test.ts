import { createSimpleNN } from '../../../../src/tasks/text-classification/models/simple-nn'
import * as helper from '../../../helpers/tasks/text-classification/constants-helper'

describe('Simple NN Model', () => {
  test('Model Creation', () => {
    const model = createSimpleNN(
      helper.MAX_LENGTH,
      helper.CLASSES.length,
      helper.FAKE_EMBEDDINGS_MATRIX,
      { units: 64, dropout: 0.2, learningRate: 0.1 }
    )
    expect(model.name).toEqual(helper.SIMPLE_NN_MODEL_NAME)
    expect(model.layers.length).toEqual(4)
  })
})
