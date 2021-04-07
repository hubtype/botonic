import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { CONFIG_FILENAME } from '../../../../src/storage/constants'
import { TextClassificationConfigStorage } from '../../../../src/tasks/text-classification/storage/config-storage'
import * as helper from '../../../helpers/tasks/text-classification/constants-helper'

describe('Config handler', () => {
  test('Load config', () => {
    const config = TextClassificationConfigStorage.load(helper.MODEL_DIR_PATH)
    expect(config.locale).toEqual(helper.LOCALE)
    expect(config.maxLength).toEqual(helper.MAX_LENGTH)
    expect(config.vocabulary).toEqual(helper.VOCABULARY)
    expect(config.classes).toEqual(helper.CLASSES)
  })

  test('Save config', () => {
    const path = join(
      helper.TEXT_CLASSIFICATION_DIR_PATH,
      'test-config-storage'
    )
    TextClassificationConfigStorage.save(path, {
      locale: helper.LOCALE,
      maxLength: helper.MAX_LENGTH,
      vocabulary: helper.VOCABULARY,
      classes: helper.CLASSES,
    })
    expect(existsSync(join(path, CONFIG_FILENAME))).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(join(path, CONFIG_FILENAME))).toBeFalsy()
  })
})
