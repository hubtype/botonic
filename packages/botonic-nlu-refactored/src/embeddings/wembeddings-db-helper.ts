import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as db from 'better-sqlite3';
import { Database, Statement } from 'better-sqlite3';
import {
  GLOBAL_WORD_EMBEDDINGS_PATH,
  WE_DB_FILE,
  SUPPORTED_EMBEDDINGS,
  BOTONIC_WORD_EMBEDDINGS_URL,
} from '../constants';
import { WordEmbeddingKind, Language, WordEmbeddingDimension } from '../types';
import { downloadIntoPath } from '../util/file-system';

export const isSupportedWordEmbedding = (
  locale: Language,
  kind: WordEmbeddingKind,
  dimension: WordEmbeddingDimension,
): boolean =>
  SUPPORTED_EMBEDDINGS[locale] &&
  SUPPORTED_EMBEDDINGS[locale][kind].includes(dimension);

export class WEmbeddingsDBHelper {
  private _embeddingsFilename: string;
  private _embeddingsAbsolutePath: string;
  private _db: Database;
  private _statement: Statement;
  isValidWEmbedding: boolean;

  constructor(
    kind: WordEmbeddingKind,
    dimension: WordEmbeddingDimension,
    locale: Language,
  ) {
    if (!isSupportedWordEmbedding(locale, kind, dimension)) {
      this.isValidWEmbedding = false;
      return;
    }
    this._embeddingsFilename = `${kind}-${dimension}d-${locale}`.concat(
      WE_DB_FILE.EXTENSION,
    );
    this._embeddingsAbsolutePath = join(
      GLOBAL_WORD_EMBEDDINGS_PATH,
      this._embeddingsFilename,
    );
    this.isValidWEmbedding = true;
  }

  private async _downloadIfNotExists(logProcess: boolean): Promise<void> {
    if (!existsSync(this._embeddingsAbsolutePath)) {
      logProcess &&
        console.debug(
          `The file '${this._embeddingsFilename}' was not found in your machine.`,
        );
      logProcess && console.debug('An automatic download will start in brief.');
      if (!existsSync(GLOBAL_WORD_EMBEDDINGS_PATH)) {
        mkdirSync(GLOBAL_WORD_EMBEDDINGS_PATH);
      }
      logProcess &&
        console.debug(`Downloading '${this._embeddingsFilename}'...`);
      logProcess &&
        console.debug(`Please, wait until the download finishes.\n`);
      const res = await downloadIntoPath({
        url: `${BOTONIC_WORD_EMBEDDINGS_URL}/${this._embeddingsFilename}`,
        downloadPath: this._embeddingsAbsolutePath,
      });
      // logProcess && console.debug(res);
    } else {
      logProcess && console.debug(`Found '${this._embeddingsFilename}'.`);
    }
  }

  async initialize({ logProcess }: { logProcess?: boolean }): Promise<void> {
    if (this.isValidWEmbedding) {
      await this._downloadIfNotExists(logProcess);
      this._connect();
      this._prepareStatement();
    }
  }

  private _connect(): void {
    this._db = new db(this._embeddingsAbsolutePath, { readonly: true });
  }

  private _prepareStatement(): void {
    this._statement = this._db.prepare(
      `SELECT * FROM ${WE_DB_FILE.TABLE_NAME} WHERE ${WE_DB_FILE.COLUMN_NAME} = ?`,
    );
  }

  get instance(): Database {
    return this._db;
  }

  async select(word: string): Promise<{ token: string; vector: number[] }> {
    const res = await this._statement.get(word);
    if (!res) return undefined;

    const { token, vector } = res;
    const floatVector = vector.split(' ').map((v: string) => parseFloat(v));
    return { token, vector: floatVector };
  }

  close(): void {
    this._db.close();
  }
}
