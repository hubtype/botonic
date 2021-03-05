import { tensor, Tensor2D } from '@tensorflow/tfjs-node'

import { WordEmbeddingManager } from './types'

export class Embedder {
  constructor(private readonly manager: WordEmbeddingManager) {}

  async generateEmbeddingsMatrix(vocabulary: string[]): Promise<Tensor2D> {
    return tensor(
      await Promise.all(
        vocabulary.map(
          async (word): Promise<number[]> =>
            await this.manager.getWordEmbedding(word)
        )
      )
    )
  }
}
