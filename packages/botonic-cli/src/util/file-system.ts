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

export function readJSON(path: string): any {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function writeJSON(path: string, object: any): void {
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
