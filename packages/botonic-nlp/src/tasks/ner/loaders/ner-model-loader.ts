import { ModelLoader } from '../../../loaders/model-loader'
import { NerModelConfig } from './types'

export class NerModelLoader extends ModelLoader {
  config: NerModelConfig

  static async from(path: string): Promise<NerModelLoader> {
    const loader = new NerModelLoader(path)
    await loader.loadModel()
    return loader
  }

  get entities(): string[] {
    return this.config.entities
  }
}
