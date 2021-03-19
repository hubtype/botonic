import { PADDING_TOKEN } from '../../../../src/preprocess/constants'
import { Processor } from '../../../../src/tasks/ner/process/processor'
import * as helper from '../../../helpers/tasks/ner/helper'

describe('NER Processor', () => {
  const processor = new Processor(
    helper.preprocessor,
    helper.sequenceCodifier,
    helper.entitiesCodifier
  )
  test('Process sample', () => {
    expect(
      processor
        .process([
          { class: '', entities: [], text: 'I love this leather jacket' },
        ])
        .x.arraySync()
    ).toEqual([[2, 28, 20, 17, 0, 0, 0, 0, 0, 0, 0, 0]])
  })

  test('Generate Input data', () => {
    const { sequence, input } = processor.generateInput('I love this t-shirt')
    expect(sequence).toEqual([
      'i',
      'love',
      't-shirt',
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
    ])
    expect(input.arraySync()).toEqual([[2, 28, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0]])
  })
})
