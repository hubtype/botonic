import { DatabaseManager } from '../../../../src/embeddings/database-manager'
import { Embedder } from '../../../../src/embeddings/embedder'
import { createBiLstmModel } from '../../../../src/tasks/ner/models/bilstm-model'
import { MODEL_NAME } from '../../../helpers/tasks/ner/test-helper'

describe('Bidirectional LSTM Model', () => {
  test('Creating model', async () => {
    // arrange
    const manager = new DatabaseManager('en', 'glove', 50)
    const embedder = await Embedder.with(manager)
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
