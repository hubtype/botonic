import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { DatabaseStorage } from '../../../src/embeddings/database/storage'
import { STOPWORDS_EN } from '../../../src/preprocess/engines/en/stopwords-en'
import { BotonicTextClassifier } from '../../../src/tasks/text-classification/botonic-text-classifier'
import { TEXT_CLASSIFIER_TEMPLATE } from '../../../src/tasks/text-classification/models/types'
import * as generalHelper from '../../helpers/general-helper'
import * as helper from '../../helpers/tasks/text-classification/constants-helper'

describe('Botonic Text Classifier', () => {
  const sut = new BotonicTextClassifier(helper.LOCALE, helper.MAX_LENGTH)

  test('Load Dataset', () => {
    const dataset = sut.loadDataset(generalHelper.DATA_DIR_PATH)
    expect(dataset.classes).toEqual(['booking', 'shopping'])
  })

  test('Split Dataset', () => {
    const dataset = sut.loadDataset(generalHelper.DATA_DIR_PATH)
    const { trainSet, testSet } = sut.splitDataset(dataset, 0.5, false)
    expect(trainSet.length).toEqual(4)
    expect(testSet.length).toEqual(4)
  })

  test('Generate Vocabulary', () => {
    const dataset = sut.loadDataset(generalHelper.DATA_DIR_PATH)
    const { trainSet } = sut.splitDataset(dataset, 0.5, false)
    sut.generateVocabulary(trainSet)
    expect(sut.vocabulary.length).toEqual(8)
  })

  test('Train and Evaluate model', async () => {
    const dataset = sut.loadDataset(generalHelper.DATA_DIR_PATH)
    const { trainSet, testSet } = sut.splitDataset(dataset, 0.5, false)
    sut.generateVocabulary(trainSet)
    sut.compile()
    await sut.createModel(
      TEXT_CLASSIFIER_TEMPLATE.SIMPLE_NN,
      await DatabaseStorage.with(
        helper.LOCALE,
        helper.EMBEDDINGS_TYPE,
        helper.EMBEDDINGS_DIMENSION
      )
    )
    await sut.train(trainSet, 4, 8)
    const evaluation = await sut.evaluate(testSet)
    expect(evaluation.accuracy).toBeGreaterThan(0.01)
    expect(evaluation.loss).toBeLessThan(2)
  })

  test('Save Model', async () => {
    const dataset = sut.loadDataset(generalHelper.DATA_DIR_PATH)
    const { trainSet } = sut.splitDataset(dataset, 0.5, false)
    sut.generateVocabulary(trainSet)
    await sut.createModel(
      TEXT_CLASSIFIER_TEMPLATE.SIMPLE_NN,
      await DatabaseStorage.with(
        helper.LOCALE,
        helper.EMBEDDINGS_TYPE,
        helper.EMBEDDINGS_DIMENSION
      )
    )
    const path = join(
      helper.TEXT_CLASSIFICATION_DIR_PATH,
      'test-botonic-text-classifier'
    )
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
