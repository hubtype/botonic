import { LayersModel, loadLayersModel } from '@tensorflow/tfjs'
import axios, { AxiosPromise } from 'axios'
import { fetch } from 'cross-fetch'

import { NlpTaskConfig } from '../storage'
import { Locale } from '../types'

export class ModelInfo<C extends NlpTaskConfig> {
  public static readonly CONFIG_FILENAME = 'config.json'
  public static readonly MODEL_FILENAME = 'model.json'

  private readonly config: AxiosPromise<C>
  private readonly model: Promise<LayersModel>

  constructor(readonly locale: Locale, readonly uri: string) {
    this.config = axios({ url: `${this.uri}/${ModelInfo.CONFIG_FILENAME}` })
    this.model = loadLayersModel(`${this.uri}/${ModelInfo.MODEL_FILENAME}`, {
      fetchFunc: fetch, // replace window.fetch to work in node environment
    })
  }

  async getConfig(): Promise<C> {
    return (await this.config).data
  }

  async getModel(): Promise<LayersModel> {
    return await this.model
  }
}
