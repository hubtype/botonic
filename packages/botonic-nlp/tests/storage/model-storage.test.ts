import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { ModelStorage } from '../../src/storage/model-storage'
import * as helper from '../helpers/constants-helper'

describe('Model Storage', () => {
  const sut = new ModelStorage()
  test('Load model', async () => {
    const model = await sut.load(helper.NER_MODEL_DIR_PATH)
    expect(model.name).toEqual('BiLstmNerModel')
  })

  test('Save model', async () => {
    const model = await sut.load(helper.NER_MODEL_DIR_PATH)
    const path = join(
      __dirname,
      '..',
      'helpers',
      'models',
      'testing-model-handler'
    )
    await sut.save(model, path)
    expect(existsSync(path)).toBeTruthy()
    expect(existsSync(join(path, 'model.json'))).toBeTruthy()
    expect(existsSync(join(path, 'weights.bin'))).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(path)).toBeFalsy()
  })
})
