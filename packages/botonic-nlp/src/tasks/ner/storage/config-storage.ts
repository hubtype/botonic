import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { CONFIG_FILENAME } from '../../../storage/constants'
import { readJSON } from '../../../utils/file-utils'
import { NerConfig } from './types'

export class NerConfigStorage {
  static load(path: string): NerConfig {
    return readJSON(join(path, CONFIG_FILENAME)) as NerConfig
  }

  static save(path: string, config: NerConfig): void {
    mkdirSync(path, { recursive: true })
    writeFileSync(join(path, CONFIG_FILENAME), JSON.stringify(config))
  }
}
