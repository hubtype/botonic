import { LayersModel } from '@tensorflow/tfjs'

import { NlpTaskConfig } from '../storage'
import { Locale } from '../types'
import { ModelInfo } from './model-info'

export abstract class ModelSelector<M, C extends NlpTaskConfig> {
  private models: { [locale: string]: M } = {}

  protected constructor(
    readonly locales: Locale[],
    readonly modelsBaseUrl: string
  ) {}

  protected async load(): Promise<this> {
    const modelsInfo = this.loadModelsInfo()
    await this.loadModels(modelsInfo)
    return this
  }

  private loadModelsInfo(): ModelInfo<C>[] {
    return this.locales.map(
      locale => new ModelInfo<C>(locale, `${this.modelsBaseUrl}/${locale}`)
    )
  }

  private async loadModels(modelsInfo: ModelInfo<C>[]): Promise<void> {
    for (const modelInfo of modelsInfo) {
      const locale = modelInfo.locale
      const config = await modelInfo.getConfig()
      const model = await modelInfo.getModel()
      this.models[locale] = this.createModel(config, model)
    }
  }

  select(locale: Locale): M {
    return this.models[locale]
  }

  protected abstract createModel(config: C, model: LayersModel): M
}
