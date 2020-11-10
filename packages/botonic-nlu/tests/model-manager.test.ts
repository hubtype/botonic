import { tensor } from '@tensorflow/tfjs-node'

import { ModelManager } from '../src/model-manager'
import { SIMPLE_NN_MODEL_PATH } from './constants'

describe('Model Manager predictions', () => {
  const input = tensor([
    [0, 0, 0, 0, 0, 0, 0, 117, 0, 1, 2, 35, 90, 19, 7, 8, 2776, 959, 95, 26],
  ])

  test('Predicting intent Id', async () => {
    const expectedOutput = 0
    const modelManager = await ModelManager.fromModelPath(SIMPLE_NN_MODEL_PATH)
    expect(modelManager.predict(input)).toEqual(expectedOutput)
  })

  test('Predicting probabilities', async () => {
    const expectedOutput = [
      { intentId: 0, confidence: 0.9997875094413757 },
      { intentId: 1, confidence: 0.00020627696358133107 },
      { intentId: 2, confidence: 0.000006030530130374245 },
      { intentId: 3, confidence: 7.528678480639428e-8 },
    ]
    const modelManager = await ModelManager.fromModelPath(SIMPLE_NN_MODEL_PATH)
    expect(modelManager.predictProbabilities(input)).toEqual(expectedOutput)
  })
})
