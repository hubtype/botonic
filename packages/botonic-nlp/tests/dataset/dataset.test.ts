import { Dataset } from '../../src/dataset/dataset'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../src/preprocess/constants'
import * as constantssHelper from '../helpers/constants-helper'
import * as toolsHelper from '../helpers/tools-helper'

describe('Dataset', () => {
  const sut = Dataset.load(constantssHelper.DATA_DIR_PATH)

  test('Load Dataset', () => {
    expect(sut.classes).toEqual(['BuyProduct', 'ReturnProduct'])
    expect(sut.entities).toEqual(['product', 'color', 'size'])
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
