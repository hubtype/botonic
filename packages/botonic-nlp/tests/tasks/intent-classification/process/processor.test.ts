import { Processor } from '../../../../src/tasks/intent-classification/process/processor'
import * as constantsHelper from '../../../helpers/constants-helper'
import * as toolsHelper from '../../../helpers/tools-helper'

// Short and long texts are used for testing because we need to check that the Processor always returns the data with the correct shape.
const SHORT_TEXT = 'I want to buy this pair of shoes.'
const LONG_TEXT =
  'I want to buy this pair of shoes, this t-shirt and also, this jacket. I also want to know if this fur coat is on sale, because I love it!'

describe('Intent Classification Processor', () => {
  const sut = new Processor(
    toolsHelper.preprocessor,
    toolsHelper.tokenEncoder,
    toolsHelper.intentEncoder
  )

  test('Process samples', () => {
    const { x, y } = sut.processSamples([
      {
        intent: 'BuyProduct',
        entities: [{ start: 27, end: 32, label: 'product' }],
        text: SHORT_TEXT,
      },
      {
        intent: 'BuyProduct',
        entities: [{ start: 27, end: 32, label: 'product' }],
        text: LONG_TEXT,
      },
    ])
    expect(x.shape).toEqual([2, constantsHelper.MAX_SEQUENCE_LENGTH])
    expect(x.arraySync()).toEqual([
      [7, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 9, 1, 1, 28, 27, 7, 1, 1, 21, 1, 11],
    ])
    expect(y.shape).toEqual([2, constantsHelper.INTENTS.length])
    expect(y.arraySync()).toEqual([
      [1, 0],
      [1, 0],
    ])
  })

  test('Texts Processing', () => {
    const input = sut.processTexts([SHORT_TEXT, LONG_TEXT])
    expect(input.arraySync()).toEqual([
      [7, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 9, 1, 1, 28, 27, 7, 1, 1, 21, 1, 11],
    ])
  })
})
