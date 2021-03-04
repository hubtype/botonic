import { NerSampleProcessor } from '../../../../src/tasks/ner/process/ner-sample-processor'
import * as helper from '../../../helpers/tasks/ner/helper'

describe('NER Sample Processor', () => {
  test('Process sample', () => {
    const processor = new NerSampleProcessor(
      helper.preprocessor,
      helper.sequenceCodifier,
      helper.entitiesCodifier
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
