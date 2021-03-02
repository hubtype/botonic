import { NerSampleProcessor } from '../../../../src/tasks/ner/process/ner-sample-processor'
import {
  entitiesCodifier,
  preprocessor,
  sequenceCodifier,
} from '../../../helpers/tasks/ner/test-helper'

describe('NER Sample Processor', () => {
  test('Process sample', () => {
    const processor = new NerSampleProcessor(
      preprocessor,
      sequenceCodifier,
      entitiesCodifier
    )
    expect(
      processor
        .process([
          { class: '', entities: [], text: 'I love this leather jacket' },
        ])
        .x.arraySync()
    ).toEqual([[2, 28, 20, 17, 0, 0, 0, 0, 0, 0, 0, 0]])
  })
})
