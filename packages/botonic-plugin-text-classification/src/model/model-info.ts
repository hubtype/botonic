import { TextClassificationConfig } from '@botonic/nlp/lib/tasks/text-classification/storage/types'
import { Locale } from '@botonic/nlp/lib/types'
import { LayersModel, loadLayersModel } from '@tensorflow/tfjs'
import axios, { AxiosPromise } from 'axios'
import { fetch } from 'cross-fetch'

import { CONFIG_FILENAME, MODEL_FILENAME } from '../constants'

export class ModelInfo {
  private readonly config: AxiosPromise<TextClassificationConfig>
  private readonly model: Promise<LayersModel>

  constructor(readonly locale: Locale, readonly uri: string) {
    this.config = axios({ url: `${this.uri}/${CONFIG_FILENAME}` })
    // fetchFunc is defined to replace window.fetch to work in node environment
    this.model = loadLayersModel(`${this.uri}/${MODEL_FILENAME}`, {
      fetchFunc: fetch,
    })
  }

  async getConfig(): Promise<TextClassificationConfig> {
    return (await this.config).data
  }

  async getModel(): Promise<LayersModel> {
    return await this.model
  }
}
