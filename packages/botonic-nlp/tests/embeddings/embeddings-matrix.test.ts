import { generateEmbeddingsMatrix } from '../../src/embeddings/embeddings-matrix'
import * as helper from '../helpers/tools-helper'

describe('Embedder', () => {
  test('Generate embeddings matrix', async () => {
    const matrix = await generateEmbeddingsMatrix(helper.wordEmbeddingStorage, [
      'red',
      'blue',
    ])
    expect(matrix.shape).toEqual([2, 50])
  })
})
