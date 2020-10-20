/* eslint-disable @typescript-eslint/unbound-method */
import { tensor, Tensor } from '@tensorflow/tfjs-node';
import { WordEmbeddingsDBHelper } from './wembeddings-db-helper';
import { WordEmbeddingsConfig } from '../types';

export class WordEmbeddingsManager {
  protected constructor(readonly matrix: Tensor) {}

  // TODO: Change the way word embedding is check to be valid.
  static async withConfig(
    config: WordEmbeddingsConfig,
  ): Promise<WordEmbeddingsManager> {
    const dbHelper = new WordEmbeddingsDBHelper(
      config.type,
      config.dimension,
      config.language,
    );
    if (!dbHelper.isValidWEmbedding) throw Error('Word Embedding not valid.');
    await dbHelper.initialize({ logProcess: true });

    const maxInitValue = 1;
    const minInitValue = -1;
    const rowsCount = Object.keys(config.vocabulary).length;
    const colsCount = config.dimension;

    const matrix = new Array(rowsCount);
    for (let i = 0; i < rowsCount; i++) {
      matrix[i] = new Array(colsCount);
      for (let j = 0; j < colsCount; j++) {
        matrix[i][j] =
          Math.random() * (maxInitValue - minInitValue) + minInitValue;
      }
    }

    for (const [word, i] of Object.entries(config.vocabulary)) {
      const embedding = await dbHelper.select(word);
      if (embedding) matrix[i] = embedding.vector;
    }

    return new WordEmbeddingsManager(tensor(matrix));
  }
}
