import { tensor } from '@tensorflow/tfjs-node'

import { ModelManager } from '../../src/model/manager'
import { ModelStorage } from '../../src/storage/model-storage'
import * as helper from '../helpers/tasks/ner/helper'

describe('Model Manager', () => {
  test('Predict', async () => {
    const manager = new ModelManager(
      await ModelStorage.load(helper.MODEL_DIR_PATH)
    )
    const x = tensor([[2, 9, 41, 18, 12, 0, 0, 0, 0, 0, 0, 0]])
    const sut = await manager.predict(x)
    expect(sut.shape).toEqual([1, 12, 5])
  })
})
