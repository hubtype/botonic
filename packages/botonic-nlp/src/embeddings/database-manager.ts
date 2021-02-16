import axios from 'axios'
import * as db from 'better-sqlite3'
import { Database, Statement } from 'better-sqlite3'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { Locale } from '../types'
import {
  DB_COLUMN_NAME,
  DB_TABLE_NAME,
  EMBEDDINGS_URL,
  GLOBAL_EMBEDDINGS_PATH,
  SUPPORTED_EMBEDDINGS,
} from './constants'
import { EmbeddingsDimension, EmbeddingsType } from './types'

export class DatabaseManager {
  private database: Database
  private statement: Statement

  constructor(
    public readonly locale: Locale,
    public readonly type: EmbeddingsType,
    public readonly dimension: EmbeddingsDimension
  ) {
    this.checkCompatibility()
  }

  private checkCompatibility() {
    if (
      !(
        this.locale in SUPPORTED_EMBEDDINGS &&
        this.type in SUPPORTED_EMBEDDINGS[this.locale] &&
        SUPPORTED_EMBEDDINGS[this.locale][this.type].includes(this.dimension)
      )
    ) {
      throw new Error(
        `Word embedding config not supported for: ${this.locale} ${this.type} ${this.dimension}`
      )
    }
  }

  async initialize(logs = true): Promise<void> {
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

    if (existsSync(path)) {
      log(`Found '${filename}'.`)
    } else {
      log(`The file '${filename}' was not found in your machine.`)
      log('An automatic download will start in brief.')
      if (!existsSync(GLOBAL_EMBEDDINGS_PATH)) {
        mkdirSync(GLOBAL_EMBEDDINGS_PATH, { recursive: true })
      }
      log(`Downloading '${filename}'...`)
      log(`Please, wait until the download finishes.\n`)
      console.log(`${EMBEDDINGS_URL}/${filename}`)
      console.log(join(EMBEDDINGS_URL, filename))
      await this.download(`${EMBEDDINGS_URL}/${filename}`, path)
    }

    return path
  }

  private async download(url: string, path: string): Promise<void> {
    try {
      const writer = createWriteStream(path)
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      })
      response.data.pipe(writer)
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    } catch (e) {
      throw new Error(
        `${e.response.status as string}: ${e.response.statusText as string}` +
          '\n' +
          `Cannot download url "${url}" into path "${path}"`
      )
    }
  }

  async getEmbedding(word: string): Promise<number[] | undefined> {
    const response = await this.statement.get(word)
    if (response) {
      return response.vector.split(' ').map((v: string) => parseFloat(v))
    } else {
      return undefined
    }
  }

  finish(): void {
    this.database.close()
  }
}
