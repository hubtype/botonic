import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { readJSON } from '../../../utils/file-utils'
import { TextClassificationConfig } from './types'

export class TextClassificationConfigStorage {
  public readonly CONFIG_FILENAME = 'config.json'

  load(path: string): TextClassificationConfig {
    return readJSON(
      join(path, this.CONFIG_FILENAME)
    ) as TextClassificationConfig
  }

  save(path: string, config: TextClassificationConfig): void {
    mkdirSync(path, { recursive: true })
    writeFileSync(join(path, this.CONFIG_FILENAME), JSON.stringify(config))
  }
}
