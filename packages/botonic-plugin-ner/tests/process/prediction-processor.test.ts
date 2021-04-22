import { NEUTRAL_ENTITY } from '@botonic/nlp/lib/tasks/ner/process/constants'

import { PredictionProcessor } from '../../src/process/prediction-processor'
import * as constantsHelper from '../helper/constants-helper'

describe('Prediction processor', () => {
  test('process prediction', () => {
    const sut = new PredictionProcessor(constantsHelper.ENTITIES)
    const entities = sut.process(
      constantsHelper.SEQUENCE,
      constantsHelper.PREDICTION
    )
    expect(entities.map(entity => entity.label)).toEqual(['product'])
    expect(entities.some(entity => entity.label === NEUTRAL_ENTITY)).toBeFalsy()
  })
})
