/* eslint-disable @typescript-eslint/unbound-method */
import { tensor, Tensor } from '@tensorflow/tfjs-node';
import { WordEmbeddingsDBHelper } from './wembeddings-db-helper';
import {
  Vocabulary,
  WordEmbeddingDimension,
  WordEmbeddingType,
  WordEmbeddingsConfig,
} from '../types';
import { Language } from '../language';

export class WordEmbeddingsManager {
  private _matrix: number[][];
  private _tensorMatrix: Tensor;
  private _type: WordEmbeddingType;
  private _dimension: WordEmbeddingDimension;
  private _language: Language;
  private _vocabulary: Vocabulary;
  private _dbHelper: WordEmbeddingsDBHelper;

  async generateWordEmbeddingsMatrix(
    config: WordEmbeddingsConfig,
  ): Promise<void> {
    this._type = config.type;
    this._dimension = config.dimension;
    this._vocabulary = config.vocabulary;
    this._language = config.language;
    await this._initializeDBHelper();
    this._initializeMatrix();
    await this._fillMatrix();
    this._tensorMatrix = tensor(this._matrix);
  }

  private async _initializeDBHelper(): Promise<void> {
    const dbHelper = new WordEmbeddingsDBHelper(
      this._type,
      this._dimension,
      this._language,
    );
    if (dbHelper.isValidWEmbedding) this._dbHelper = dbHelper;
    await this._dbHelper.initialize({ logProcess: true });
  }

  private _initializeMatrix(): void {
    const maxInitValue = 1;
    const minInitValue = -1;
    const rowsCount = Object.keys(this._vocabulary).length;
    const colsCount = this._dimension;

    this._matrix = new Array(rowsCount);
    for (let i = 0; i < rowsCount; i++) {
      this._matrix[i] = new Array(colsCount);
      for (let j = 0; j < colsCount; j++) {
        this._matrix[i][j] =
          Math.random() * (maxInitValue - minInitValue) + minInitValue;
      }
    }
  }

  private async _fillMatrix(): Promise<void> {
    for (const [word, i] of Object.entries(this._vocabulary)) {
      const embedding = await this._dbHelper.select(word);
      if (embedding) this._matrix[i] = embedding.vector;
    }
  }

  get wordEmbeddingsMatrix(): Tensor {
    return this._tensorMatrix;
  }
  get matrix(): number[][] {
    return this._matrix;
  }
}
