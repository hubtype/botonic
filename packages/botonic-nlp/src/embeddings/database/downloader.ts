import axios from 'axios'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { Locale } from '../../types'
import { EMBEDDINGS_URL, GLOBAL_EMBEDDINGS_PATH } from './constants'
import { EmbeddingsDimension, EmbeddingsType } from './types'

export class DatabaseDownloader {
  static async download(
    locale: Locale,
    type: EmbeddingsType,
    dimension: EmbeddingsDimension
  ): Promise<void> {
    const filename = `${type}-${dimension}d-${locale}.db`
    this.createDirectory()
    await this.downloadIntoPath(
      `${EMBEDDINGS_URL}/${filename}`,
      join(GLOBAL_EMBEDDINGS_PATH, filename)
    )
  }

  private static createDirectory(): void {
    if (!existsSync(GLOBAL_EMBEDDINGS_PATH)) {
      mkdirSync(GLOBAL_EMBEDDINGS_PATH, { recursive: true })
    }
  }

  private static async downloadIntoPath(
    url: string,
    path: string
  ): Promise<void> {
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
}
