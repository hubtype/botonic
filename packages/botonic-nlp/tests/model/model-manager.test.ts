import { tensor } from '@tensorflow/tfjs-node'

import { ModelManager } from '../../src/model/manager'
import { ModelStorage } from '../../src/storage/model-storage'
import * as helper from '../helpers/constants-helper'

describe('Model Manager', () => {
  test('Predict', async () => {
    const manager = new ModelManager(
      await ModelStorage.load(helper.NER_MODEL_DIR_PATH)
    )
    const x = tensor([[2, 10, 14, 13, 0, 0, 0, 0, 0, 0, 0, 0]])
    const sut = await manager.predict(x)
    expect(sut.shape).toEqual([
      1,
      helper.MAX_SEQUENCE_LENGTH,
      helper.ENTITIES.length + 1,
    ])
  })
})
