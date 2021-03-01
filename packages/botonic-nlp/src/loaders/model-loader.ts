import { LayersModel, loadLayersModel } from '@tensorflow/tfjs-node'
import { readFileSync } from 'fs'
import { join } from 'path'

import { Locale } from '../types'
import { MODEL_CONFIG_FILENAME } from './constants'
import { ModelConfig } from './types'

export class ModelLoader {
  config: ModelConfig
  model: LayersModel

  protected constructor(readonly path: string) {
    this.loadModelConfig()
  }

  protected loadModelConfig(): void {
    this.config = JSON.parse(
      readFileSync(join(this.path, MODEL_CONFIG_FILENAME), 'utf-8')
    )
  }

  protected async loadModel(): Promise<void> {
    this.model = await loadLayersModel(`file://${this.path}/model.json`)
  }

  get locale(): Locale {
    return this.config.locale
  }

  get maxLength(): number {
    return this.config.maxLength
  }

  get vocabulary(): string[] {
    return this.config.vocabulary
  }
}
