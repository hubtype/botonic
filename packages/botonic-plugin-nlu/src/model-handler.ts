import { default as fetch } from 'node-fetch'
import { Vocabulary } from '@botonic/nlu/dist/types'
import { Language } from '@botonic/nlu/dist/language'
import { Preprocessor } from '@botonic/nlu/dist/preprocessor'
import type { NluResult } from '@botonic/core'
import { Tensor } from '@tensorflow/tfjs'

import {
  BotonicPluginNLUOptions,
  ModelInformation,
  PreprocessingOptions,
} from './types'
import { getModelInfoFromEnv } from './environment-utils'
import { detectLang, inputToTensor, predictionToIntent } from './prediction'

// Support for fetch API in Node (Lambda Env): https://stackoverflow.com/a/48433898
// @ts-ignore
global.fetch = fetch

export class ModelHandler {
  private languages: Language[] = []
  private modelInfo: ModelInformation = {}

  constructor(options: BotonicPluginNLUOptions) {
    // @ts-ignore
    return (async () => {
      this.languages = Object.keys(options) as Language[]
      await this.loadModelInformation(options)
      return this
    })()
  }

  initPreprocessor(
    language: Language,
    options: PreprocessingOptions,
    vocabulary: Vocabulary,
    maxSeqLen: number
  ): Preprocessor {
    return new Preprocessor(
      language,
      maxSeqLen,
      vocabulary,
      options.normalizer,
      options.tokenizer,
      options.stemmer
    )
  }

  async loadModelInformation(
    options: BotonicPluginNLUOptions
  ): Promise<ModelHandler> {
    const promises = {}
    this.languages.forEach(lang => (promises[lang] = getModelInfoFromEnv(lang)))
    for (const lang of this.languages) {
      this.modelInfo[lang] = {}
      this.modelInfo[lang].language = lang
      this.modelInfo[lang].model = await promises[lang].model
      const modelData = (await promises[lang].modelData).data
      this.modelInfo[lang].modelData = modelData
      this.modelInfo[lang].preprocessor = this.initPreprocessor(
        lang,
        options[lang],
        modelData.vocabulary,
        modelData.maxSeqLen
      )
    }
    return await this // eslint-disable-line @typescript-eslint/await-thenable
  }

  predict(input: string): NluResult {
    const lang = detectLang(input, this.languages)
    const { model, modelData } = this.modelInfo[lang]
    const tensor = inputToTensor(input, this.modelInfo[lang].preprocessor)
    const prediction = model.predict(tensor as any)
    const intent = predictionToIntent(
      (prediction as any) as Tensor,
      modelData.intents,
      lang
    )
    return intent
  }
}
