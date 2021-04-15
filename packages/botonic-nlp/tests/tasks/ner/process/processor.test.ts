import { PADDING_TOKEN } from '../../../../src/preprocess/constants'
import { Processor } from '../../../../src/tasks/ner/process/processor'
import * as helper from '../../../helpers/tools-helper'

describe('NER Processor', () => {
  const sut = new Processor(
    helper.preprocessor,
    helper.tokenEncoder,
    helper.entitiesEncoder
  )
  test('Process sample', () => {
    expect(
      sut
        .process([
          { class: '', entities: [], text: 'I love this leather jacket' },
        ])
        .x.arraySync()
    ).toEqual([[6, 11, 1, 27, 0, 0, 0, 0, 0, 0, 0, 0]])
  })

  test('Generate Input data', () => {
    const { sequence, input } = sut.generateInput('I love this t-shirt')
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
    expect(input.arraySync()).toEqual([[6, 11, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0]])
  })
})
