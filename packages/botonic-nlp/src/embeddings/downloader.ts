import axios from 'axios'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

export class Downloader {
  static async download(url: string, path: string): Promise<void> {
    const dirPath = dirname(path)
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
    await this.downloadIntoPath(url, path)
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
