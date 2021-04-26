import { TextClassificationConfig } from '@botonic/nlp/lib/tasks/text-classification/storage/types'
import { Locale } from '@botonic/nlp/lib/types'
import { LayersModel } from '@tensorflow/tfjs'

export class ModelInfo {
  constructor(readonly locale: Locale, readonly uri: string) {
    // TODO: pending to be implemented
  }

  async getConfig(): Promise<TextClassificationConfig> {
    // TODO: pending to be implemented
    return null
  }

  async getModel(): Promise<LayersModel> {
    // TODO: pending to be implemented
    return null
  }
}
