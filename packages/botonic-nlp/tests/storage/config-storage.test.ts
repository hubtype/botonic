import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { ConfigStorage } from '../../src/storage/config-storage'
import { IntentClassifierConfig } from '../../src/tasks/intent-classification'
import { NerConfig } from '../../src/tasks/ner'
import * as helper from '../helpers/constants-helper'

describe('Config Storage', () => {
  test('Load NER Config', () => {
    const sut = new ConfigStorage<NerConfig>()
    const config = sut.load(helper.NER_MODEL_DIR_PATH)
    expect(config).toEqual({
      locale: helper.LOCALE,
      maxLength: helper.MAX_SEQUENCE_LENGTH,
      vocabulary: helper.VOCABULARY,
      entities: ['O'].concat(helper.ENTITIES),
    })
  })

  test('Load Intent Config', () => {
    const sut = new ConfigStorage<IntentClassifierConfig>()
    const config = sut.load(helper.INTENT_CLASSIFIER_MODEL_DIR_PATH)
    expect(config).toEqual({
      locale: helper.LOCALE,
      maxLength: helper.MAX_SEQUENCE_LENGTH,
      vocabulary: helper.VOCABULARY,
      intents: helper.INTENTS,
    })
  })

  test('Save Intent Config', () => {
    const sut = new ConfigStorage<IntentClassifierConfig>()
    const tmpPath = join(helper.HELPER_DIR, 'tmpConfigStorage')
    sut.save(
      {
        locale: helper.LOCALE,
        maxLength: helper.MAX_SEQUENCE_LENGTH,
        vocabulary: helper.VOCABULARY,
        intents: helper.INTENTS,
      },
      tmpPath
    )
    const configPath = join(tmpPath, sut.CONFIG_FILENAME)
    expect(existsSync(configPath)).toBeTruthy()
    rmdirSync(tmpPath, { recursive: true })
    expect(existsSync(configPath)).toBeFalsy()
  })
})
