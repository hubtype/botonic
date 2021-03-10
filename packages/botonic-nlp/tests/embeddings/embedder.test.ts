import { Embedder } from '../../src/embeddings/embedder'
import * as helper from '../helpers/tasks/ner/helper'

describe('Embedder', () => {
  test('Generate embeddings matrix', async () => {
    const embedder = new Embedder(helper.testWordEmbeddingManager)
    const matrix = await embedder.generateEmbeddingsMatrix(['red', 'blue'])
    expect(matrix.shape).toEqual([2, 50])
  })
})
