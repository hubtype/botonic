import { generateEmbeddingsMatrix } from '../../src/embeddings/embeddings-matrix'
import * as helper from '../helpers/tasks/ner/helper'

describe('Embedder', () => {
  test('Generate embeddings matrix', async () => {
    const matrix = await generateEmbeddingsMatrix(
      helper.testWordEmbeddingStorage,
      ['red', 'blue']
    )
    expect(matrix.shape).toEqual([2, 50])
  })
})
