import { PredictionProcessor } from '../../src/process/prediction-processor'
import * as constantsHelper from '../helper/constants-helper'

describe('Prediction processor', () => {
  test('process prediction', () => {
    const processor = new PredictionProcessor(constantsHelper.ENTITIES)
    const sut = processor.process(
      constantsHelper.SEQUENCE,
      constantsHelper.PREDICTION
    )
    expect(sut.map(entity => entity.label)).toEqual(['O', 'O', 'product'])
  })
})
