export interface WordEmbeddingManager {
  getWordEmbedding(word: string): Promise<number[]>
}
