import { NerConfig } from '@botonic/nlp/dist/tasks/ner/storage/types'
import { Locale } from '@botonic/nlp/dist/types'
import { LayersModel } from '@tensorflow/tfjs'

export type ModelInfo = {
  config: NerConfig
  model: LayersModel
}

export type BotonicPluginNerOptions = { locale: Locale }
