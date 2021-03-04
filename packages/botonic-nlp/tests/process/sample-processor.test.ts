import { SampleProcessor } from '../../src/process/sample-processor'
import * as helper from '../helpers/tasks/ner/helper'

describe('Sample Processor', () => {
  test('Process input', () => {
    const processor = new SampleProcessor(
      helper.preprocessor,
      helper.sequenceCodifier
    )
    const sut = processor.processInput('I love this leather jacket')
    expect(sut.sequence).toEqual([
      'i',
      'love',
      'leather',
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
    expect(sut.input.arraySync()).toEqual([
      [2, 28, 20, 17, 0, 0, 0, 0, 0, 0, 0, 0],
    ])
  })
})
