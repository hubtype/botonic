import * as db from 'better-sqlite3'
import { Database, Statement } from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

import {
  BOTONIC_GLOBAL_DIRNAME,
  BOTONIC_GLOBAL_WE_DIRNAME,
  BOTONIC_WORD_EMBEDDINGS_URL,
  SUPPORTED_EMBEDDINGS,
  WE_DB_FILE,
} from '../constants'
import { Language } from '../language'
import { WordEmbeddingDimension, WordEmbeddingType } from '../types'
import { downloadIntoPath } from '../util/file-system'

const GLOBAL_WORD_EMBEDDINGS_PATH = join(
  homedir(),
  BOTONIC_GLOBAL_DIRNAME,
  BOTONIC_GLOBAL_WE_DIRNAME
)

export function isSupportedWordEmbedding(
  locale: Language,
  kind: WordEmbeddingType,
  dimension: WordEmbeddingDimension
): boolean {
  return (
    SUPPORTED_EMBEDDINGS[locale] &&
    SUPPORTED_EMBEDDINGS[locale][kind].includes(dimension)
  )
}

export class WordEmbeddingsDBHelper {
  private _embeddingsFilename: string
  private _embeddingsAbsolutePath: string
  private _db: Database
  private _statement: Statement

  constructor(
    kind: WordEmbeddingType,
    dimension: WordEmbeddingDimension,
    locale: Language
  ) {
    if (!isSupportedWordEmbedding(locale, kind, dimension)) {
      throw new Error(
        `Word embedding config not supported for: ${locale} ${kind} ${dimension}`
      )
    }
    this._embeddingsFilename = `${kind}-${dimension}d-${locale}${WE_DB_FILE.EXTENSION}`
    this._embeddingsAbsolutePath = join(
      GLOBAL_WORD_EMBEDDINGS_PATH,
      this._embeddingsFilename
    )
  }

  private async _downloadIfNotExists(logProcess: boolean): Promise<void> {
    const log = (msg: string) => logProcess && console.debug(msg)
    if (!existsSync(this._embeddingsAbsolutePath)) {
      log(
        `The file '${this._embeddingsFilename}' was not found in your machine.`
      )
      log('An automatic download will start in brief.')
      if (!existsSync(GLOBAL_WORD_EMBEDDINGS_PATH)) {
        mkdirSync(GLOBAL_WORD_EMBEDDINGS_PATH, { recursive: true })
      }
      log(`Downloading '${this._embeddingsFilename}'...`)
      log(`Please, wait until the download finishes.\n`)
      await downloadIntoPath({
        url: `${BOTONIC_WORD_EMBEDDINGS_URL}/${this._embeddingsFilename}`,
        downloadPath: this._embeddingsAbsolutePath,
      })
    } else {
      log(`Found '${this._embeddingsFilename}'.`)
    }
  }

  async initialize({
    logProcess = true,
  }: {
    logProcess: boolean
  }): Promise<void> {
    await this._downloadIfNotExists(logProcess)
    this._connect()
    this._prepareStatement()
  }

  private _connect(): void {
    this._db = new db(this._embeddingsAbsolutePath, { readonly: true })
  }

  private _prepareStatement(): void {
    this._statement = this._db.prepare(
      `SELECT * FROM ${WE_DB_FILE.TABLE_NAME} WHERE ${WE_DB_FILE.COLUMN_NAME} = ?`
    )
  }

  get instance(): Database {
    return this._db
  }

  async select(
    word: string
  ): Promise<{ token: string; vector: number[] } | undefined> {
    const res = await this._statement.get(word)
    if (!res) return undefined

    const { token, vector } = res
    const floatVector = vector.split(' ').map((v: string) => parseFloat(v))
    return { token, vector: floatVector }
  }

  close(): void {
    this._db.close()
  }
}
