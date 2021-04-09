import { Processor } from '../../../../src/tasks/text-classification/process/processor'
import * as helper from '../../../helpers/tasks/text-classification/tools-helper'

describe('Text Classification Processor', () => {
  const sut = new Processor(
    helper.preprocessor,
    helper.tokensEncoder,
    helper.classEncoder
  )

  test('Sample Processing', () => {
    const { x, y } = sut.process([
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
      [2, 37, 36, 26, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 37, 38, 17, 0, 0, 0, 0, 0, 0, 0, 0],
    ])
    expect(y.arraySync()).toEqual([
      [0, 1, 0],
      [1, 0, 0],
    ])
  })

  test('Input Generation', () => {
    const input = sut.generateInput(
      'I want to create a order with this leather jacket?'
    )
    expect(input.arraySync()).toEqual([[2, 37, 1, 4, 1, 20, 17, 0, 0, 0, 0, 0]])
  })
})
