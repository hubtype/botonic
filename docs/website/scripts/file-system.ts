import { readFileSync, readdirSync, writeFileSync } from 'fs'

const UTF8: BufferEncoding = 'utf-8'

export const readJSON = (filePath: string): void =>
  JSON.parse(readFileSync(filePath, UTF8))

export const writeJSON = (filePath: string, data): void =>
  writeFileSync(filePath, JSON.stringify(data, null, 2))

export const readDir = readdirSync
export const readFile = (path: string): string => readFileSync(path, UTF8)
export const writeFile = writeFileSync
