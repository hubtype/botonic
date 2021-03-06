import { tensor } from '@tensorflow/tfjs-node'

import { PredictionProcessor } from '../../../../src/tasks/intent-classification/process/prediction-processor'
import { OutputData } from '../../../../src/tasks/intent-classification/process/types'
import * as helper from '../../../helpers/constants-helper'

describe('Prediction Processor', () => {
  test('Process Prediction', () => {
    const prediction = tensor([[0.3, 0.7]]) as OutputData
    const sut = new PredictionProcessor(helper.INTENTS)
    const intents = sut.process(prediction)
    expect(intents.length).toEqual(helper.INTENTS.length)
    expect(intents[0].label).toEqual(helper.INTENTS[1])
  })
})
