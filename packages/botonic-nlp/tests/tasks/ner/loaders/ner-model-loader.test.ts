import { join } from 'path'

import { NerModelLoader } from '../../../../src/tasks/ner/loaders/ner-model-loader'
import {
  ENTITIES,
  LOCALE,
  MAX_LENGTH,
  MODEL_NAME,
  VOCABULARY,
} from '../../../helpers/tasks/ner/test-helper'

describe('Ner Model Loader', () => {
  test('locale loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'helpers', 'models', 'ner')
    )
    expect(loader.locale).toEqual(LOCALE)
  })

  test('maxLength loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'helpers', 'models', 'ner')
    )
    expect(loader.maxLength).toEqual(MAX_LENGTH)
  })

  test('vocabulary loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'helpers', 'models', 'ner')
    )
    expect(loader.vocabulary).toEqual(VOCABULARY)
  })

  test('entities loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'helpers', 'models', 'ner')
    )
    expect(loader.entities).toEqual(ENTITIES)
  })

  test('model loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'helpers', 'models', 'ner')
    )
    expect(loader.model.name).toEqual(MODEL_NAME)
  })
})
