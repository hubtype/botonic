import { NerConfig } from '@botonic/nlp/dist/tasks/ner/storage/types'
import { Locale } from '@botonic/nlp/dist/types'
import { LayersModel } from '@tensorflow/tfjs'
import { AxiosPromise } from 'axios'

export type ModelInfoPromise = {
  config: AxiosPromise<NerConfig>
  model: Promise<LayersModel>
}

export type PluginOptions = { locales: Locale[] }
