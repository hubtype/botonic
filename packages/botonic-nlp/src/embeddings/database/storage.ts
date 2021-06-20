import * as db from 'better-sqlite3'
import { Database, Statement } from 'better-sqlite3'
import { existsSync } from 'fs'
import { join } from 'path'

import { Locale } from '../../types'
import { Downloader } from '../downloader'
import { WordEmbeddingStorage } from '../types'
import {
  DB_COLUMN_NAME,
  DB_TABLE_NAME,
  EMBEDDINGS_URL,
  GLOBAL_EMBEDDINGS_PATH,
  SUPPORTED_EMBEDDINGS,
} from './constants'
import { EmbeddingsDimension, EmbeddingsType } from './types'

export class DatabaseStorage implements WordEmbeddingStorage {
  private database: Database
  private statement: Statement
  public compatible: boolean

  private constructor(
    public readonly locale: Locale,
    public readonly type: EmbeddingsType,
    public readonly dimension: EmbeddingsDimension
  ) {
    this.checkCompatibility()
  }

  static async with(
    locale: Locale,
    type: EmbeddingsType,
    dimension: EmbeddingsDimension
  ): Promise<DatabaseStorage> {
    const manager = new DatabaseStorage(locale, type, dimension)
    if (manager.compatible) {
      await manager.initialize()
    }
    return manager
  }

  private checkCompatibility(): void {
    if (this.locale in SUPPORTED_EMBEDDINGS) {
      if (this.type in SUPPORTED_EMBEDDINGS[this.locale]) {
        if (
          SUPPORTED_EMBEDDINGS[this.locale][this.type].includes(this.dimension)
        ) {
          this.compatible = true
          return
        }
      }
    }
    console.warn(
      `Word embedding config not supported for: ${this.locale} ${this.type} ${this.dimension}`
    )
    this.compatible = false
  }

  private async initialize(logs = true): Promise<void> {
    const path = await this.checkEmbeddingsFile(logs)
    this.database = new db(path, { readonly: true })
    this.statement = this.database.prepare(
      `SELECT * FROM ${DB_TABLE_NAME} WHERE ${DB_COLUMN_NAME} = ?`
    )
  }

  private async checkEmbeddingsFile(logs: boolean): Promise<string> {
    const log = (msg: string) => logs && console.debug(msg)
    const filename = `${this.type}-${this.dimension}d-${this.locale}.db`
    const path = join(GLOBAL_EMBEDDINGS_PATH, filename)

    if (!existsSync(path)) {
      log(`The file '${filename}' was not found in your machine.`)
      log('An automatic download will start in brief.')
      log(`Downloading '${filename}'...`)
      log(`Please, wait until the download finishes.\n`)
      const url = `${EMBEDDINGS_URL}/${filename}`
      await Downloader.download(url, path)
      log('Download successfully completed.')
    }
    log(`Found '${filename}'.`)
    return path
  }

  async getWordEmbedding(word: string): Promise<number[]> {
    if (this.compatible) {
      const response = await this.statement.get(word)
      if (response) {
        return response.vector.split(' ').map((v: string) => parseFloat(v))
      }
    }
    return Array(this.dimension).fill(Math.random() * 2 - 1)
  }

  finish(): void {
    if (this.compatible) {
      this.database.close()
    }
  }
}
