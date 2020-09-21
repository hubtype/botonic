import * as tf from '@tensorflow/tfjs-node';
import { Word2Index, WordEmbeddingsCompleteConfig } from '../types';

import { WEmbeddingsDBHelper } from './wembeddings-db-helper';
import { Tensor } from '@tensorflow/tfjs-node';

export class WordEmbeddingsMatrix {
  rowsSize: number;
  columnsSize: number;
  vocabulary: Word2Index;
  private _dbHelper: WEmbeddingsDBHelper = undefined;
  private _matrix: number[][] = [];

  constructor(config: WordEmbeddingsCompleteConfig, vocabulary: Word2Index) {
    this.rowsSize = Object.keys(vocabulary).length;
    this.columnsSize = config.dimension;
    this.vocabulary = vocabulary;
    const dbHelper = new WEmbeddingsDBHelper(
      config.kind,
      config.dimension,
      config.locale,
    );
    if (dbHelper.isValidWEmbedding) this._dbHelper = dbHelper;
  }

  get isValid(): boolean {
    return Boolean(this._dbHelper);
  }

  async load(): Promise<boolean> {
    if (this._dbHelper) {
      await this._dbHelper.initialize({ logProcess: true });
      return true;
    }
    return false;
  }

  get matrix(): number[][] {
    return this._matrix;
  }

  get tensorMatrix(): Tensor {
    return tf.tensor(this._matrix);
  }

  async getEmbeddingForWord(
    word: string,
  ): Promise<{ token: string; vector: number[] }> {
    return await this._dbHelper.select(word);
  }

  private _betweenMinusOneAndOne(): number {
    const min = -1;
    const max = 1;
    return Math.random() * (max - min) + min;
  }

  init(
    initialValue: any = this._betweenMinusOneAndOne,
    rows: number = this.rowsSize,
    columns: number = this.columnsSize,
  ): number[][] {
    // initialValue accepts a function which generates numbers
    const matrix = [];
    for (let m = 0; m < rows; m++) {
      matrix[m] = new Array(this.columnsSize);
      for (let n = 0; n < columns; n++) {
        matrix[m][n] = initialValue();
      }
    }
    this._matrix = matrix;
    return matrix;
  }
  async fill(): Promise<void> {
    let outOfEmbeddingWords = 0;
    for (const [word, index] of Object.entries(this.vocabulary)) {
      if (index === 0) continue; // SKIP <UNK> TOKEN
      const res = await this.getEmbeddingForWord(word);
      if (!res) outOfEmbeddingWords++;
      else this._matrix[index] = res.vector;
    }
    await this._dbHelper.close();
    console.debug('Words not found in embedding: ', outOfEmbeddingWords);
  }
  async generate(initialValue = this._betweenMinusOneAndOne): Promise<void> {
    this.init(initialValue);
    if (this.isValid) await this.fill();
  }
}
