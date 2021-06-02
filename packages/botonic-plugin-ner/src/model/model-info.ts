import { NerConfig } from '@botonic/nlp/lib/tasks/ner/storage'
import { Locale } from '@botonic/nlp/lib/types'
import { LayersModel, loadLayersModel } from '@tensorflow/tfjs'
import axios, { AxiosPromise } from 'axios'
import { fetch } from 'cross-fetch'

import { CONFIG_FILENAME, MODEL_FILENAME } from '../constants'

export class ModelInfo {
  private readonly config: AxiosPromise<NerConfig>
  private readonly model: Promise<LayersModel>

  constructor(readonly locale: Locale, readonly uri: string) {
    this.config = axios({ url: `${this.uri}/${CONFIG_FILENAME}` })
    this.model = loadLayersModel(`${this.uri}/${MODEL_FILENAME}`, {
      fetchFunc: fetch, // replace window.fetch to work in node environment
    })
  }

  async getConfig(): Promise<NerConfig> {
    return (await this.config).data
  }

  async getModel(): Promise<LayersModel> {
    return await this.model
  }
}