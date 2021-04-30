import { tensor2d } from '@tensorflow/tfjs'

import { TextProcessor } from '../../src/process/text-processor'
import * as constantsHelper from '../helpers/constants-helper'
import * as toolsHelper from '../helpers/tools-helper'

describe('TextProcessor test', () => {
  test('Process text', () => {
    const sut = new TextProcessor(
      constantsHelper.VOCABULARY,
      toolsHelper.preprocessor
    )
    const { sequence, input } = sut.process('I want to buy this jacket')
    expect(sequence).toEqual([
      'i',
      'want',
      'buy',
      'jacket',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
    ])
    expect(input.arraySync()).toEqual([[6, 7, 9, 27, 0, 0, 0, 0, 0, 0, 0, 0]])
  })
})
