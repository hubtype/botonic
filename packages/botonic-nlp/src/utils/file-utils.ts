import { readFileSync } from 'fs'

export function readJSON(path: string): any {
  return JSON.parse(readFileSync(path, 'utf8'))
}
