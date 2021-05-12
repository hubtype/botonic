import { Dataset } from '../../src/dataset/dataset'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../src/preprocess/constants'
import * as constantsHelper from '../helpers/constants-helper'
import * as toolsHelper from '../helpers/tools-helper'

describe('Dataset', () => {
  const sut = Dataset.load(constantsHelper.DATA_DIR_PATH)

  test('Load Dataset', () => {
    expect(sut.intents.sort()).toEqual(constantsHelper.INTENTS.sort())
    expect(sut.entities.sort()).toEqual(constantsHelper.ENTITIES.sort())
    expect(sut.samples.length).toEqual(180)
  })

  test('Split Dataset', () => {
    const { trainSet, testSet } = sut.split(0.25)
    expect(trainSet.length).toEqual(135)
    expect(testSet.length).toEqual(45)
  })

  test('Wrong Split Proportions', () => {
    expect(() => {
      sut.split(2)
    }).toThrowError()
  })

  test('Vocabulary Extraction', () => {
    const vocabulary = toolsHelper.dataset.extractVocabulary(
      toolsHelper.preprocessor
    )
    expect(vocabulary.length).toBeGreaterThan(2)
    expect(vocabulary.includes(PADDING_TOKEN)).toBeTruthy()
    expect(vocabulary.includes(UNKNOWN_TOKEN)).toBeTruthy()
  })
})
