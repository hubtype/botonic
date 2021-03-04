import { createBiLstmModel } from '../../../../src/tasks/ner/models/bilstm-model'
import { MODEL_NAME } from '../../../helpers/tasks/ner/helper'
import * as helper from '../../../helpers/tasks/ner/helper'

describe('Bidirectional LSTM Model', () => {
  test('Creating model', async () => {
    // arrange
    const embedder = await helper.getEmbedder()
    const embeddingsMatrix = await embedder.generateEmbeddingsMatrix([
      'where',
      'order',
      '?',
      'i',
      'want',
      'return',
      'products',
      "n't",
      't-shirt',
    ])

    // act
    const model = createBiLstmModel(
      12,
      ['O', 'product', 'material'],
      embeddingsMatrix
    )

    // assert
    expect(model.name).toEqual(MODEL_NAME)
  })
})
