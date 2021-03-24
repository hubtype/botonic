import { InputGenerator } from '../../src/preprocess/input-generator'
import * as constantsHelper from '../helper/constants-helper'
import * as toolsHelper from '../helper/tools-helper'

describe('Input generator', () => {
  test('generate input', () => {
    const generator = new InputGenerator(
      toolsHelper.preprocessor,
      toolsHelper.tokenCodifier
    )

    const sut = generator.generate(constantsHelper.SENTENCE)
    expect(sut.sequence).toEqual(constantsHelper.SEQUENCE)
    expect(sut.input.arraySync()).toEqual(constantsHelper.INPUT.arraySync())
  })
})
