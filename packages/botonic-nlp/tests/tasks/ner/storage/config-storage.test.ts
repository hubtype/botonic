import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { CONFIG_FILENAME } from '../../../../src/storage/constants'
import { NerConfigStorage } from '../../../../src/tasks/ner/storage/config-storage'
import * as helper from '../../../helpers/constants-helper'

describe('Config handler', () => {
  test('Load config', () => {
    const config = NerConfigStorage.load(helper.NER_MODEL_DIR_PATH)
    expect(config.locale).toEqual(helper.LOCALE)
    expect(config.maxLength).toEqual(helper.MAX_SEQUENCE_LENGTH)
    expect(config.vocabulary).toEqual(helper.VOCABULARY)
    expect(config.entities).toEqual(['O'].concat(helper.ENTITIES))
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
    NerConfigStorage.save(path, {
      locale: helper.LOCALE,
      maxLength: helper.MAX_SEQUENCE_LENGTH,
      vocabulary: helper.VOCABULARY,
      entities: helper.ENTITIES,
    })
    expect(existsSync(join(path, CONFIG_FILENAME))).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(join(path, CONFIG_FILENAME))).toBeFalsy()
  })
})
