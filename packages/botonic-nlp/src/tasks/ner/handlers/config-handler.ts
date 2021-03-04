import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { MODEL_CONFIG_FILENAME } from '../../../handlers/constants'
import { NerModelConfig } from './types'

export class NerConfigHandler {
  static load(path: string): NerModelConfig {
    const config = JSON.parse(
      readFileSync(join(path, MODEL_CONFIG_FILENAME), 'utf-8')
    )
    return config
  }

  static save(path: string, config: NerModelConfig): void {
    mkdirSync(path, { recursive: true })
    writeFileSync(join(path, MODEL_CONFIG_FILENAME), JSON.stringify(config))
  }
}
