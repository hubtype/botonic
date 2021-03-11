import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { CONFIG_FILENAME } from '../../../storage/constants'
import { NerConfig } from './types'

export class NerConfigStorage {
  static load(path: string): NerConfig {
    const config = JSON.parse(
      readFileSync(join(path, CONFIG_FILENAME), { encoding: 'utf-8' })
    )
    return config
  }

  static save(path: string, config: NerConfig): void {
    mkdirSync(path, { recursive: true })
    writeFileSync(join(path, CONFIG_FILENAME), JSON.stringify(config))
  }
}
