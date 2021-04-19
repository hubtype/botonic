import { Tensor3D } from '@tensorflow/tfjs-node'

import { ModelManager } from '../../../../src/model/manager'
import { ModelStorage } from '../../../../src/storage/model-storage'
import { PredictionProcessor } from '../../../../src/tasks/ner/process/prediction-processor'
import * as constantsHelper from '../../../helpers/constants-helper'
import * as toolsHelper from '../../../helpers/tools-helper'

describe('Prediction processor', () => {
  test('process prediction', async () => {
    const manager = new ModelManager(
      await ModelStorage.load(constantsHelper.NER_MODEL_DIR_PATH)
    )
    const { sequence, input } = toolsHelper.nerProcessor.generateInput(
      'I want to return this jacket'
    )
    const prediction = manager.predict(input) as Tensor3D
    const sut = new PredictionProcessor(constantsHelper.ENTITIES)
    const entities = sut.process(sequence, prediction)
    expect(entities.length).toEqual(4)
  })
})
