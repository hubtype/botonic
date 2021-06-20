import { tensor2d } from '@tensorflow/tfjs'

import { PredictionProcessor } from '../../src/process/prediction-processor'
import * as constantsHelper from '../helper/constants-helper'

describe('Prediction processor', () => {
  test('Process prediction', () => {
    const sut = new PredictionProcessor(constantsHelper.INTENTS)
    const intents = sut.process(tensor2d([[0.2, 0.7, 0.1]]))
    expect(intents.map(i => i.label)).toEqual(['return', 'buy', 'availability'])
  })
})
