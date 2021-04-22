import { Tensor3D } from '@tensorflow/tfjs-node'

import { ModelManager } from '../../../../src/model/manager'
import { ModelStorage } from '../../../../src/storage/model-storage'
import { NEUTRAL_ENTITY } from '../../../../src/tasks/ner/process/constants'
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
    const sut = new PredictionProcessor(
      [NEUTRAL_ENTITY].concat(constantsHelper.ENTITIES)
    )
    const entities = sut.process(sequence, prediction)
    expect(entities.length).toEqual(1)
    expect(entities.map(e => e.label)).toEqual(['product'])
    expect(entities.map(e => e.text)).toEqual(['jacket'])
    expect(entities.some(e => e.label === NEUTRAL_ENTITY)).toBeFalsy()
  })
})
