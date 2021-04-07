import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { CONFIG_FILENAME } from '../../../storage/constants'
import { readJSON } from '../../../utils/file-utils'
import { TextClassificationConfig } from './types'

export class TextClassificationConfigStorage {
  static load(path: string): TextClassificationConfig {
    return readJSON(join(path, CONFIG_FILENAME)) as TextClassificationConfig
  }

  static save(path: string, config: TextClassificationConfig): void {
    mkdirSync(path, { recursive: true })
    writeFileSync(join(path, CONFIG_FILENAME), JSON.stringify(config))
  }
}
