import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { DatabaseStorage } from '../../../src/embeddings/database/storage'
import { STOPWORDS_EN } from '../../../src/preprocess/engines/en/stopwords-en'
import { BotonicTextClassifier } from '../../../src/tasks/text-classification/botonic-text-classifier'
import { TEXT_CLASSIFIER_TEMPLATE } from '../../../src/tasks/text-classification/models/types'
import * as generalHelper from '../../helpers/general-helper'
import * as helper from '../../helpers/tasks/text-classification/constants-helper'

describe('Botonic Text Classifier', () => {
  const classifier = new BotonicTextClassifier(helper.LOCALE, helper.MAX_LENGTH)

  test('Load Dataset', () => {
    const sut = classifier.loadDataset(generalHelper.DATA_DIR_PATH)
    expect(sut.classes).toEqual(['booking', 'shopping'])
  })

  test('Split Dataset', () => {
    const dataset = classifier.loadDataset(generalHelper.DATA_DIR_PATH)
    const sut = classifier.splitDataset(dataset, 0.5, false)
    expect(sut.trainSet.length).toEqual(4)
    expect(sut.testSet.length).toEqual(4)
  })

  test('Generate Vocabulary', () => {
    const dataset = classifier.loadDataset(generalHelper.DATA_DIR_PATH)
    const { trainSet } = classifier.splitDataset(dataset, 0.5, false)
    classifier.generateVocabulary(trainSet)
    expect(classifier.vocabulary.length).toEqual(8)
  })

  test('Save Model', async () => {
    const dataset = classifier.loadDataset(generalHelper.DATA_DIR_PATH)
    const { trainSet } = classifier.splitDataset(dataset, 0.5, false)
    classifier.generateVocabulary(trainSet)
    await classifier.createModel(
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
    await classifier.saveModel(path)
    expect(existsSync(path)).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(path)).toBeFalsy()
  })

  test('Get Stopwords', () => {
    const sut = classifier.stopwords
    expect(sut).toEqual(STOPWORDS_EN)
  })

  test('Set Stopwords', () => {
    classifier.stopwords = ['this', 'is']
    const sut = classifier.stopwords
    expect(sut).toEqual(['this', 'is'])
  })
})
