import { Processor } from '../../../../src/tasks/text-classification/process/processor'
import * as constantsHelper from '../../../helpers/constants-helper'
import * as toolsHelper from '../../../helpers/tools-helper'

describe('Text Classification Processor', () => {
  const sut = new Processor(
    toolsHelper.preprocessor,
    toolsHelper.tokenEncoder,
    toolsHelper.classEncoder
  )

  test('Process samples', () => {
    const { x, y } = sut.processSamples([
      {
        class: 'BuyProduct',
        entities: [{ start: 27, end: 32, text: 'shoes', label: 'product' }],
        text: 'I want to buy this pair of shoes.',
      },
      {
        class: 'BuyProduct',
        entities: [{ start: 27, end: 32, text: 'shoes', label: 'product' }],
        text:
          'I want to buy this pair of shoes, this t-shirt and also, this jacket. I also want to know if this fur coat is on sale, because I love it!',
      },
    ])
    expect(x.shape).toEqual([2, constantsHelper.MAX_SEQUENCE_LENGTH])
    expect(y.shape).toEqual([2, constantsHelper.CLASSES.length])
    expect(x.arraySync()).toEqual([
      [6, 7, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [6, 7, 9, 1, 1, 28, 27, 6, 7, 1, 1, 21],
    ])
    expect(y.arraySync()).toEqual([
      [1, 0],
      [1, 0],
    ])
  })

  test('Texts Processing', () => {
    const input = sut.processTexts([
      'I want to buy this pair of shoes.',
      'I want to buy this pair of shoes, this t-shirt and also, this jacket. I also want to know if this fur coat is on sale, because I love it!',
    ])
    expect(input.arraySync()).toEqual([
      [6, 7, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [6, 7, 9, 1, 1, 28, 27, 6, 7, 1, 1, 21],
    ])
  })
})
