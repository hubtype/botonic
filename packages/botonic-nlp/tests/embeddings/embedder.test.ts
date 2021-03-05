import { DatabaseManager } from '../../src/embeddings/database/manager'
import { Embedder } from '../../src/embeddings/embedder'

describe('Embedder', () => {
  test('Generate embeddings matrix', async () => {
    const manager = await DatabaseManager.with('en', 'glove', 50)
    const embedder = new Embedder(manager)
    const matrix = await embedder.generateEmbeddingsMatrix(['red', 'blue'])
    expect(matrix.shape).toEqual([2, 50])
  })
})
