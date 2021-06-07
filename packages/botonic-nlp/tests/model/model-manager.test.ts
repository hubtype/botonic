import { tensor } from '@tensorflow/tfjs-node'

import { ModelManager } from '../../src/model/manager'
import { ModelStorage } from '../../src/storage/model-storage'
import * as helper from '../helpers/constants-helper'

describe('Model Manager', () => {
  test('Predict', async () => {
    const model = await new ModelStorage().load(helper.NER_MODEL_DIR_PATH)
    const sut = new ModelManager(model)
    const x = tensor([[2, 10, 14, 13, 0, 0, 0, 0, 0, 0, 0, 0]])
    const prediction = sut.predict(x)
    expect(prediction.shape).toEqual([
      1,
      helper.MAX_SEQUENCE_LENGTH,
      helper.ENTITIES.length + 1,
    ])
  })
})
