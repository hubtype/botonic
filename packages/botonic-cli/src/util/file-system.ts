import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import { homedir } from 'os'
import { basename } from 'path'

import { JSONObject } from '../interfaces.js'
import { isWindows } from './environment-info.js'
import { execCommand } from './system.js'

export function pathExists(path: string): boolean {
  return existsSync(path)
}

export function readDir(path: string): string[] {
  return readdirSync(path)
}

export function readJSON(path: string): JSONObject | undefined {
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

export function copyRecursively(from: string, to: string): void {
  /*
   * Copy a file or directory.
   * src: if src is a directory it will copy everything inside of this directory, not the entire directory itself.
   * dest: Note that if src is a file, dest cannot be a directory
   */
  cpSync(from, to, { recursive: true })
}

export function removeRecursively(path: string): void {
  rmSync(path, { recursive: true, force: true })
}

export function getHomeDirectory(): string {
  return isWindows() ? homedir() : execCommand('eval echo ~${SUDO_USER}')
}

export function getCurrentDirectory() {
  return basename(process.cwd())
}
