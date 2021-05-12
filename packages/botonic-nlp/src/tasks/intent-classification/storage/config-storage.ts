import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { readJSON } from '../../../utils/file-utils'
import { IntentClassificationConfig } from './types'

export class IntentClassificationConfigStorage {
  public readonly CONFIG_FILENAME = 'config.json'

  load(path: string): IntentClassificationConfig {
    return readJSON(
      join(path, this.CONFIG_FILENAME)
    ) as IntentClassificationConfig
  }

  save(path: string, config: IntentClassificationConfig): void {
    mkdirSync(path, { recursive: true })
    writeFileSync(join(path, this.CONFIG_FILENAME), JSON.stringify(config))
  }
}
