import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { ENCODINGS } from '../constants'

export const readJSON = (filePath: string): void =>
  JSON.parse(readFileSync(filePath, ENCODINGS.UTF8 as BufferEncoding))

export const writeJSON = (filePath: string, data): void =>
  writeFileSync(filePath, JSON.stringify(data, null, 2))

export const readDir = readdirSync
export const readFile = (path: string): string =>
  readFileSync(path, ENCODINGS.UTF8 as BufferEncoding)
export const writeFile = writeFileSync
