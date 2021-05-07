import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { DatabaseStorage } from '../../../src/embeddings/database/storage'
import { BotonicTextClassifier } from '../../../src/tasks/text-classification/botonic-text-classifier'
import { TEXT_CLASSIFIER_TEMPLATE } from '../../../src/tasks/text-classification/models/types'
import * as constantsHelper from '../../helpers/constants-helper'
import * as toolsHelper from '../../helpers/tools-helper'

describe('Botonic Text Classifier', () => {
  const { trainSet, testSet } = toolsHelper.dataset.split()
  const vocabulary = trainSet.extractVocabulary(toolsHelper.preprocessor)
  const sut = new BotonicTextClassifier(
    constantsHelper.LOCALE,
    constantsHelper.MAX_SEQUENCE_LENGTH,
    constantsHelper.CLASSES,
    vocabulary,
    toolsHelper.preprocessor
  )

  test('Train and Evaluate model', async () => {
    const model = await sut.createModel(
      TEXT_CLASSIFIER_TEMPLATE.SIMPLE_NN,
      await DatabaseStorage.with(
        constantsHelper.LOCALE,
        constantsHelper.EMBEDDINGS_TYPE,
        constantsHelper.EMBEDDINGS_DIMENSION
      )
    )
    sut.setModel(model)
    await sut.train(trainSet, 4, 8)
    const { accuracy, loss } = await sut.evaluate(testSet)
    expect(accuracy).toBeGreaterThan(0.01)
    expect(loss).toBeLessThan(2)
  })

  test('Save Model', async () => {
    const model = await sut.createModel(
      TEXT_CLASSIFIER_TEMPLATE.SIMPLE_NN,
      await DatabaseStorage.with(
        constantsHelper.LOCALE,
        constantsHelper.EMBEDDINGS_TYPE,
        constantsHelper.EMBEDDINGS_DIMENSION
      )
    )
    sut.setModel(model)
    const path = join(constantsHelper.HELPER_DIR, 'tmp-botonic-text-classifier')
    await sut.saveModel(path)
    expect(existsSync(path)).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(path)).toBeFalsy()
  })
})
