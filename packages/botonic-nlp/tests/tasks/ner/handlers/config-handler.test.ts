import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { MODEL_CONFIG_FILENAME } from '../../../../src/handlers/constants'
import { NerConfigHandler } from '../../../../src/tasks/ner/handlers/config-handler'
import * as helper from '../../../helpers/tasks/ner/helper'

describe('Config handler', () => {
  test('Load config', () => {
    const config = NerConfigHandler.load(helper.MODEL_DIR_PATH)
    expect(config.locale).toEqual(helper.LOCALE)
    expect(config.maxLength).toEqual(helper.MAX_LENGTH)
    expect(config.vocabulary).toEqual(helper.VOCABULARY)
    expect(config.entities).toEqual(helper.ENTITIES)
  })

  test('Save config', () => {
    const path = join(
      __dirname,
      '..',
      '..',
      '..',
      'helpers',
      'tasks',
      'ner',
      'test-config-handler'
    )
    NerConfigHandler.save(path, {
      locale: helper.LOCALE,
      maxLength: helper.MAX_LENGTH,
      vocabulary: helper.VOCABULARY,
      entities: helper.ENTITIES,
    })
    expect(existsSync(join(path, MODEL_CONFIG_FILENAME))).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(join(path, MODEL_CONFIG_FILENAME))).toBeFalsy()
  })
})
