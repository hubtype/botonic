import axios from 'axios'
import {
  createWriteStream,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from 'fs'
import { ENCODINGS } from '../constants'

export async function downloadIntoPath({
  url,
  downloadPath,
}: {
  url: string
  downloadPath: string
}): Promise<void> {
  try {
    const fileWriter = createWriteStream(downloadPath)
    const downloadedFile = await axios.get(url, { responseType: 'stream' })
    downloadedFile.data.pipe(fileWriter)
    return new Promise((resolve, reject) => {
      fileWriter.on('finish', resolve)
      fileWriter.on('error', reject)
    })
  } catch (e) {
    let error =
      `${e.response.status as string}: ${e.response.statusText as string}` +
      '\n'
    error += `Cannot download url "${url}" into path "${downloadPath}"`
    throw new Error(error)
  }
}

export function createDir(path: string): void {
  mkdirSync(path)
}

export function pathExists(path: string): boolean {
  return existsSync(path)
}

export function readJSON(jsonPath: string): any {
  return JSON.parse(
    readFileSync(jsonPath, { encoding: ENCODINGS.UTF8 as BufferEncoding })
  )
}

export function writeJSON(jsonPath: string, object: any): void {
  writeFileSync(jsonPath, JSON.stringify(object, null, 2))
}

export function createDirIfNotExists(path: string): void {
  if (!pathExists(path)) createDir(path)
}
