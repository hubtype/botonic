import { Processor } from '../../../../src/tasks/text-classification/process/processor'
import * as helper from '../../../helpers/tools-helper'

describe('Text Classification Processor', () => {
  const sut = new Processor(
    helper.preprocessor,
    helper.tokenEncoder,
    helper.classEncoder
  )

  test('Sample Processing', () => {
    const { x, y } = sut.processSamples([
      {
        text: 'I want to buy this shirt',
        class: 'BuyProduct',
        entities: [],
      },
      {
        text: 'I want to return this jacket',
        class: 'ReturnProduct',
        entities: [],
      },
    ])
    expect(x.arraySync()).toEqual([
      [6, 7, 9, 2, 0, 0, 0, 0, 0, 0, 0, 0],
      [6, 7, 8, 27, 0, 0, 0, 0, 0, 0, 0, 0],
    ])
    expect(y.arraySync()).toEqual([
      [1, 0],
      [0, 1],
    ])
  })

  test('Texts Processing', () => {
    const input = sut.processTexts([
      'I want to create a order with this leather jacket?',
    ])
    expect(input.arraySync()).toEqual([[6, 7, 1, 16, 1, 1, 27, 0, 0, 0, 0, 0]])
  })
})
