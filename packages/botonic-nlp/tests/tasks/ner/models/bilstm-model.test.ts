import { createBiLstmModel } from '../../../../src/tasks/ner/models/bilstm-model'
import { MODEL_NAME } from '../../../helpers/tasks/ner/helper'
import * as helper from '../../../helpers/tasks/ner/helper'

describe('Bidirectional LSTM Model', () => {
  test('Creating model', async () => {
    const model = createBiLstmModel(
      12,
      ['O', 'product', 'material'],
      helper.EMBEDDINGS_MATRIX
    )
    expect(model.name).toEqual(MODEL_NAME)
  })
})
