import { tensor2d } from '@tensorflow/tfjs'

import { PredictionProcessor } from '../../src/process/prediction-processor'

describe('PredictionProcessor test', () => {
  test('Predict output tensor', () => {
    const sut = new PredictionProcessor(['buyProduct', 'returnProduct'])
    const intents = sut.process(tensor2d([[0.98, 0.02]]))
    expect(intents[0].label).toEqual('buyProduct')
    expect(intents[0].confidence).toBeGreaterThan(0.9)
  })
})
