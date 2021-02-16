import { tensor, Tensor2D } from '@tensorflow/tfjs-node'

import { DatabaseManager } from './database-manager'

export class Embedder {
  private constructor(private readonly manager: DatabaseManager) {}

  static async with(manager: DatabaseManager): Promise<Embedder> {
    await manager.initialize()
    return new Embedder(manager)
  }

  async generateEmbeddingsMatrix(vocabulary: string[]): Promise<Tensor2D> {
    return tensor(
      await Promise.all(
        vocabulary.map(
          async (word): Promise<number[]> => await this.processEmbedding(word)
        )
      )
    )
  }

  private async processEmbedding(
    word: string,
    random = true
  ): Promise<number[]> {
    const embedding = await this.manager.getEmbedding(word)
    if (embedding) {
      return embedding
    } else {
      const auxVector = Array(this.manager.dimension).fill(0)
      if (random) {
        return auxVector.map(() => Math.random() * 2 - 1)
      } else {
        return auxVector
      }
    }
  }

  finish(): void {
    this.manager.finish()
  }
}
