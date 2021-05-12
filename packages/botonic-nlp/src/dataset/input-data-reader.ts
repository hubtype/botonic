import { lstatSync, readdirSync, readFileSync } from 'fs'
import { load as loadYaml } from 'js-yaml'
import { extname, join } from 'path'

import { AugmenterMap } from './data-augmenter'

export type InputData = {
  intent?: string
  entities?: string[]
  'data-augmentation'?: AugmenterMap
  samples: string[]
}

export class InputDataReader {
  readonly filePaths: string[]
  readonly ALLOWED_EXTENSIONS = ['.yaml', '.yml']

  constructor(readonly path: string) {
    this.filePaths = this.getInputFilePaths(path)
  }

  read(): InputData[] {
    return this.filePaths.map(path => loadYaml(readFileSync(path)))
  }

  private getInputFilePaths(path: string): string[] {
    const stat = lstatSync(path)

    if (!stat.isDirectory()) {
      throw new Error(`path '${path}' must be a directory.`)
    }

    return readdirSync(path)
      .filter(fileName => this.ALLOWED_EXTENSIONS.includes(extname(fileName)))
      .map(fileName => join(path, fileName))
  }
}
