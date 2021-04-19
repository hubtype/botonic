import { Dataset } from '../../src/dataset/dataset'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../src/preprocess/constants'
import * as helper from '../helpers/tools-helper'

describe('Dataset', () => {
  const sut = new Dataset(
    ['BuyProduct', 'ReturnProduct'],
    ['product', 'material'],
    [
      { text: 'I want to buy this', class: 'BuyProduct', entities: [] },
      { text: 'I want to return this', class: 'ReturnProduct', entities: [] },
      {
        text: 'I would like to return it',
        class: 'ReturnProduct',
        entities: [],
      },
      { text: 'I would like to buy it', class: 'BuyProduct', entities: [] },
    ]
  )

  test('Split Dataset', () => {
    const { trainSet, testSet } = sut.split(0.25)
    expect(trainSet.length).toEqual(3)
    expect(testSet.length).toEqual(1)
  })

  test('Wrong Split Proportions', () => {
    expect(() => {
      sut.split(2)
    }).toThrowError()
  })

  test('Vocabulary Extraction', () => {
    const vocabulary = helper.dataset.extractVocabulary(helper.preprocessor, [
      PADDING_TOKEN,
      UNKNOWN_TOKEN,
    ])
    expect(vocabulary.length).toBeGreaterThan(2)
    expect(vocabulary.includes(PADDING_TOKEN)).toBeTruthy()
    expect(vocabulary.includes(UNKNOWN_TOKEN)).toBeTruthy()
  })
})
