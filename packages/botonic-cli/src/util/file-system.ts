import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  writeFileSync,
} from 'fs'
import { copySync } from 'fs-extra'

export function pathExists(path: string): boolean {
  return existsSync(path)
}

export function readDir(path: string): string[] {
  return readdirSync(path)
}

export type Json = Record<string, unknown>

export function readJSON(path: string): Json | undefined {
  const fileContent = readFileSync(path, 'utf8')
  if (!fileContent) return undefined
  return JSON.parse(fileContent)
}

export function writeJSON(path: string, object: JSON): void {
  writeFileSync(path, JSON.stringify(object))
}

export function create(path: string): void {
  return mkdirSync(path)
}

export function createTemp(name: string): string {
  return mkdtempSync(name)
}

export function copy(from: string, to: string): void {
  copySync(from, to)
}

export function remove(path: string): void {
  rmdirSync(path, { recursive: true })
}
