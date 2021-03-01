import { DatabaseManager } from '../../../../src/embeddings/database-manager'
import { Embedder } from '../../../../src/embeddings/embedder'
import { createBiLstmModel } from '../../../../src/tasks/ner/models/bilstm-model'

describe('Bidirectional LSTM Model', () => {
  test('Creating model', async () => {
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
    expect(
      createBiLstmModel(12, ['O', 'product', 'material'], embeddingsMatrix).name
    ).toEqual('BiLstmNerModel')
  })
})
