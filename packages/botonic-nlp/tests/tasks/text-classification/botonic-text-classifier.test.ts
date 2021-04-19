import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { DatabaseStorage } from '../../../src/embeddings/database/storage'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../../src/preprocess/constants'
import { STOPWORDS_EN } from '../../../src/preprocess/engines/en/stopwords-en'
import { BotonicTextClassifier } from '../../../src/tasks/text-classification/botonic-text-classifier'
import { TEXT_CLASSIFIER_TEMPLATE } from '../../../src/tasks/text-classification/models/types'
import * as constantsHelper from '../../helpers/constants-helper'
import * as toolsHelper from '../../helpers/tools-helper'

describe('Botonic Text Classifier', () => {
  const sut = new BotonicTextClassifier(
    constantsHelper.LOCALE,
    constantsHelper.MAX_SEQUENCE_LENGTH,
    constantsHelper.CLASSES
  )

  test('Generate Vocabulary', () => {
    const { trainSet } = toolsHelper.dataset.split()
    sut.generateVocabulary(trainSet)
    expect(sut.vocabulary.length).toBeGreaterThan(2)
    expect(sut.vocabulary.includes(PADDING_TOKEN)).toBeTruthy()
    expect(sut.vocabulary.includes(UNKNOWN_TOKEN)).toBeTruthy()
  })

  test('Train and Evaluate model', async () => {
    const { trainSet, testSet } = toolsHelper.dataset.split()
    sut.generateVocabulary(trainSet)
    sut.compile()
    await sut.createModel(
      TEXT_CLASSIFIER_TEMPLATE.SIMPLE_NN,
      await DatabaseStorage.with(
        constantsHelper.LOCALE,
        constantsHelper.EMBEDDINGS_TYPE,
        constantsHelper.EMBEDDINGS_DIMENSION
      )
    )
    await sut.train(trainSet, 4, 8)
    const { accuracy, loss } = await sut.evaluate(testSet)
    expect(accuracy).toBeGreaterThan(0.01)
    expect(loss).toBeLessThan(2)
  })

  test('Save Model', async () => {
    const { trainSet } = toolsHelper.dataset.split(0.5, false)
    sut.generateVocabulary(trainSet)
    await sut.createModel(
      TEXT_CLASSIFIER_TEMPLATE.SIMPLE_NN,
      await DatabaseStorage.with(
        constantsHelper.LOCALE,
        constantsHelper.EMBEDDINGS_TYPE,
        constantsHelper.EMBEDDINGS_DIMENSION
      )
    )
    const path = join(constantsHelper.HELPER_DIR, 'tmp-botonic-text-classifier')
    await sut.saveModel(path)
    expect(existsSync(path)).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(path)).toBeFalsy()
  })

  test('Get Stopwords', () => {
    const stopwords = sut.stopwords
    expect(stopwords).toEqual(STOPWORDS_EN)
  })

  test('Set Stopwords', () => {
    sut.stopwords = ['this', 'is']
    const stopwords = sut.stopwords
    expect(stopwords).toEqual(['this', 'is'])
  })
})
