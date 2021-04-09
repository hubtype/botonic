import { Processor } from '../../../../src/tasks/text-classification/process/processor'
import * as helper from '../../../helpers/tasks/text-classification/tools-helper'

describe('Text Classification Processor', () => {
  const processor = new Processor(
    helper.preprocessor,
    helper.tokensEncoder,
    helper.classEncoder
  )
  test('Sample Processing', () => {
    const sut = processor.process([
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
    expect(sut.x.arraySync()).toEqual([
      [2, 37, 36, 26, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 37, 38, 17, 0, 0, 0, 0, 0, 0, 0, 0],
    ])
    expect(sut.y.arraySync()).toEqual([
      [0, 1, 0],
      [1, 0, 0],
    ])
  })

  test('Input Generation', () => {
    const sut = processor.generateInput(
      'I want to create a order with this leather jacket?'
    )
    expect(sut.arraySync()).toEqual([[2, 37, 1, 4, 1, 20, 17, 0, 0, 0, 0, 0]])
  })
})
