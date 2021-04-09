import { tensor } from '@tensorflow/tfjs-node'

import {
  Intent,
  PredictionProcessor,
} from '../../../../src/tasks/text-classification/process/prediction-processor'
import { OutputData } from '../../../../src/tasks/text-classification/process/types'
import * as helper from '../../../helpers/tasks/text-classification/constants-helper'

describe('Prediction Processor', () => {
  test('Process Prediction', () => {
    const prediction = tensor([[0.4, 0.5, 0.1]]) as OutputData
    const processor = new PredictionProcessor(helper.CLASSES)
    const sut = processor.process(prediction)
    expect(sut.length).toEqual(helper.CLASSES.length)
    expect(sut[0]).toEqual(new Intent(helper.CLASSES[1], 0.5))
  })
})
