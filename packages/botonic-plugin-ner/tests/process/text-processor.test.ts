import { TextProcessor } from '../../src/process/text-processor'
import * as constantsHelper from '../helper/constants-helper'
import * as toolsHelper from '../helper/tools-helper'

describe('Input generator', () => {
  test('generate input', () => {
    const processor = new TextProcessor(
      constantsHelper.VOCABULARY,
      toolsHelper.preprocessor
    )

    const sut = processor.process(constantsHelper.SENTENCE)
    expect(sut.sequence).toEqual(constantsHelper.SEQUENCE)
    expect(sut.input.arraySync()).toEqual(constantsHelper.INPUT.arraySync())
  })
})
