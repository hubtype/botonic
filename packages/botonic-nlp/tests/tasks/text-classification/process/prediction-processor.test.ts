import { tensor } from '@tensorflow/tfjs-node'

import { PredictionProcessor } from '../../../../src/tasks/text-classification/process/prediction-processor'
import { OutputData } from '../../../../src/tasks/text-classification/process/types'
import * as helper from '../../../helpers/constants-helper'

describe('Prediction Processor', () => {
  test('Process Prediction', () => {
    const prediction = tensor([[0.3, 0.7]]) as OutputData
    const sut = new PredictionProcessor(helper.CLASSES)
    const intents = sut.process(prediction)
    expect(intents.length).toEqual(helper.CLASSES.length)
    expect(intents[0].label).toEqual(helper.CLASSES[1])
  })
})
