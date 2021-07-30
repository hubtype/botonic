import { PADDING_TOKEN } from '@botonic/nlp/lib/preprocess'
import { tensor2d } from '@tensorflow/tfjs'

import { TextProcessor } from '../../src/process/text-processor'
import * as constantsHelper from '../helper/constants-helper'
import * as toolsHelper from '../helper/tools-helper'

describe('Text Processor', () => {
  const sut = new TextProcessor(
    constantsHelper.VOCABULARY,
    toolsHelper.preprocessor
  )

  test.each([
    [
      'I want to buy this pair of shoes.',
      [
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
        PADDING_TOKEN,
      ],
      [[7, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]],
    ],
    [
      'I want to buy this pair of shoes, this t-shirt and also, this jacket. I also want to know if this fur coat is on sale, because I love it!',
      [
        'want',
        'buy',
        'pair',
        'shoes',
        't-shirt',
        'jacket',
        'want',
        'know',
        'fur',
        'coat',
        'sale',
        'love',
      ],
      [[7, 9, 1, 1, 28, 27, 7, 1, 1, 21, 1, 11]],
    ],
  ])(
    'Generate sequence and input of text',
    (text, expectedSequence, expectedInput) => {
      const { sequence, input } = sut.process(text)
      expect(sequence).toEqual(expectedSequence)
      expect(input.arraySync()).toEqual(expectedInput)
    }
  )
})
