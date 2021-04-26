import { PADDING_TOKEN } from '@botonic/nlp/lib/preprocess/constants'
import { tensor, Tensor3D } from '@tensorflow/tfjs'

import { PredictionProcessor } from '../../src/process/prediction-processor'
import * as constantsHelper from '../helper/constants-helper'

describe('Prediction processor', () => {
  test('Process prediction', () => {
    const sut = new PredictionProcessor(constantsHelper.ENTITIES)
    const entities = sut.process(
      [
        'i',
        'want',
        'buy',
        'pair',
        'shoes',
        PADDING_TOKEN,
        PADDING_TOKEN,
        PADDING_TOKEN,
        PADDING_TOKEN,
        PADDING_TOKEN,
        PADDING_TOKEN,
        PADDING_TOKEN,
      ],
      tensor([
        [
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
        ],
      ]) as Tensor3D
    )
    expect(entities.map(entity => entity.label)).toEqual(['product'])
  })
})
