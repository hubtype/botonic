import { tensor, Tensor2D } from '@tensorflow/tfjs-node'

import { WordEmbeddingStorage } from './types'

export async function generateEmbeddingsMatrix(
  storage: WordEmbeddingStorage,
  vocabulary: string[]
): Promise<Tensor2D> {
  return tensor(
    await Promise.all(
      vocabulary.map(
        async (word): Promise<number[]> => await storage.getWordEmbedding(word)
      )
    )
  )
}
