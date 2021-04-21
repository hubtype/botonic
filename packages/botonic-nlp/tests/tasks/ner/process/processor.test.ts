import { PADDING_TOKEN } from '../../../../src/preprocess/constants'
import { Processor } from '../../../../src/tasks/ner/process/processor'
import * as constantsHelper from '../../../helpers/constants-helper'
import * as toolsHelper from '../../../helpers/tools-helper'

describe('NER Processor', () => {
  const sut = new Processor(
    toolsHelper.preprocessor,
    toolsHelper.tokenEncoder,
    toolsHelper.entitiesEncoder
  )
  // The samples text has been chosen so we have a short and a long sentence.
  test('Process samples', () => {
    const { x, y } = sut.process([
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
    expect(x.arraySync()).toEqual([
      [6, 7, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [6, 7, 9, 1, 1, 28, 27, 6, 7, 1, 1, 21],
    ])
    expect(y.shape).toEqual([
      2,
      constantsHelper.MAX_SEQUENCE_LENGTH,
      constantsHelper.ENTITIES.length + 1,
    ])
    expect(y.arraySync()).toEqual([
      [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ],
      [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ],
    ])
  })

  test('Generate Sequence and Input of short text', () => {
    const { sequence, input } = sut.generateInput(
      'I want to buy this pair of shoes.'
    )
    expect(sequence.length).toEqual(constantsHelper.MAX_SEQUENCE_LENGTH)
    expect(sequence).toEqual([
      'i',
      'want',
      'buy',
      'pair',
      'shoes',
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
    ])
    expect(input.shape).toEqual([1, constantsHelper.MAX_SEQUENCE_LENGTH])
    expect(input.arraySync()).toEqual([[6, 7, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0]])
  })

  test('Generate Sequence and Input of long text', () => {
    const { sequence, input } = sut.generateInput(
      'I want to buy this pair of shoes, this t-shirt and also, this jacket. I also want to know if this fur coat is on sale, because I love it!'
    )
    expect(sequence.length).toEqual(constantsHelper.MAX_SEQUENCE_LENGTH)
    expect(sequence).toEqual([
      'i',
      'want',
      'buy',
      'pair',
      'shoes',
      't-shirt',
      'jacket',
      'i',
      'want',
      'know',
      'fur',
      'coat',
    ])
    expect(input.shape).toEqual([1, constantsHelper.MAX_SEQUENCE_LENGTH])
    expect(input.arraySync()).toEqual([[6, 7, 9, 1, 1, 28, 27, 6, 7, 1, 1, 21]])
  })
})
