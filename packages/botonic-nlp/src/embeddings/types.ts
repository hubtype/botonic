export interface WordEmbeddingStorage {
  getWordEmbedding(word: string): Promise<number[]>
}
