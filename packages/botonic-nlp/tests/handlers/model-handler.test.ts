import { tensor } from '@tensorflow/tfjs-node'
import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { ModelHandler } from '../../src/handlers/model-handler'
import * as helper from '../helpers/tasks/ner/helper'

describe('Model handler', () => {
  test('Load model', async () => {
    const handler = await ModelHandler.load(helper.MODEL_DIR_PATH)
    expect(handler.model.name).toEqual('BiLstmNerModel')
  })
  test('Predict', async () => {
    const handler = await ModelHandler.load(helper.MODEL_DIR_PATH)
    const x = tensor([[2, 9, 41, 18, 12, 0, 0, 0, 0, 0, 0, 0]])
    const sut = await handler.predict(x)
    expect(sut.shape).toEqual([1, 12, 5])
  })

  test('Save model', async () => {
    const handler = await ModelHandler.load(helper.MODEL_DIR_PATH)
    const path = join(
      __dirname,
      '..',
      'helpers',
      'models',
      'testing-model-handler'
    )
    await handler.save(path)
    expect(existsSync(path)).toBeTruthy()
    expect(existsSync(join(path, 'model.json'))).toBeTruthy()
    expect(existsSync(join(path, 'weights.bin'))).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(path)).toBeFalsy()
  })
})
