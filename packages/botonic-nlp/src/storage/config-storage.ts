import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { Locale } from '../types'
import { readJSON } from '../utils/file-utils'

export interface NlpTaskConfig {
  locale: Locale
  maxLength: number
  vocabulary: string[]
}

export class ConfigStorage<T extends NlpTaskConfig> {
  public readonly CONFIG_FILENAME = 'config.json'

  load(path: string): T {
    return readJSON(join(path, this.CONFIG_FILENAME))
  }

  save(config: T, path: string): void {
    mkdirSync(path, { recursive: true })
    writeFileSync(join(path, this.CONFIG_FILENAME), JSON.stringify(config))
  }
}
