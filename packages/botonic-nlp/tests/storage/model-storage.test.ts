import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { ModelStorage } from '../../src/storage/model-storage'
import * as helper from '../helpers/tasks/ner/helper'

describe('Model Storage', () => {
  test('Load model', async () => {
    const model = await ModelStorage.load(helper.MODEL_DIR_PATH)
    expect(model.name).toEqual('BiLstmNerModel')
  })

  test('Save model', async () => {
    const model = await ModelStorage.load(helper.MODEL_DIR_PATH)
    const path = join(
      __dirname,
      '..',
      'helpers',
      'models',
      'testing-model-handler'
    )
    await ModelStorage.save(model, path)
    expect(existsSync(path)).toBeTruthy()
    expect(existsSync(join(path, 'model.json'))).toBeTruthy()
    expect(existsSync(join(path, 'weights.bin'))).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(path)).toBeFalsy()
  })
})
