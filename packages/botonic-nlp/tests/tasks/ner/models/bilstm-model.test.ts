import { createBiLstmModel } from '../../../../src/tasks/ner/models/bilstm-model'
import * as helper from '../../../helpers/constants-helper'

describe('Bidirectional LSTM Model', () => {
  test('Creating model', async () => {
    const model = createBiLstmModel(
      12,
      ['O', 'product', 'material'],
      helper.EMBEDDINGS_MATRIX
    )
    expect(model.name).toEqual('BiLstmNerModel')
  })
})
