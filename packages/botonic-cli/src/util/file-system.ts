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
import { homedir } from 'os'

import { isWindows } from './environment-info'
import { execCommand } from './system'

export function pathExists(path: string): boolean {
  return existsSync(path)
}

export function readDir(path: string): string[] {
  return readdirSync(path)
}

export function readJSON(path: string): any {
  const fileContent = readFileSync(path, 'utf8')
  if (!fileContent) return undefined
  return JSON.parse(fileContent)
}

export function writeJSON(path: string, object: any): void {
  writeFileSync(path, JSON.stringify(object))
}

export function createDir(path: string): void {
  // If directory already exists, it will throw an error.
  return mkdirSync(path)
}

export function createTempDir(name: string): string {
  return mkdtempSync(name)
}

export function copy(from: string, to: string): void {
  /*
   * Copy a file or directory.
   * src: if src is a directory it will copy everything inside of this directory, not the entire directory itself.
   * dest: Note that if src is a file, dest cannot be a directory
   */
  copySync(from, to)
}

export function removeRecursively(path: string): void {
  rmdirSync(path, { recursive: true })
}

export function getHomeDirectory(): string {
  return isWindows() ? homedir() : execCommand('eval echo ~${SUDO_USER}')
}
