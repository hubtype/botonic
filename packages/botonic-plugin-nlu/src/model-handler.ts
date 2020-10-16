import { default as fetch } from 'node-fetch'
import { Vocabulary } from '@botonic/nlu/dist/types'
import { Language } from '@botonic/nlu/dist/language'
import { Preprocessor } from '@botonic/nlu/dist/preprocessor'

import {
  BotonicPluginNLUOptions,
  ModelInformation,
  PreprocessingOptions,
  Result,
} from './types'
import { getModelInfoForEnv } from './environment-utils'
import { detectLang, inputToTensor, predictionToIntent } from './prediction'

// @ts-ignore
global.fetch = fetch

export class ModelHandler {
  private languages: Language[]
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
    options: PreprocessingOptions,
    vocabulary: Vocabulary,
    maxSeqLen: number
  ): Preprocessor {
    const preprocessor = new Preprocessor()
    if (options.tokenizer) preprocessor.tokenizer = options.tokenizer
    if (options.normalizer) preprocessor.normalizer = options.normalizer
    if (options.stemmer) preprocessor.stemmer = options.stemmer
    preprocessor.vocabulary = vocabulary
    preprocessor.maxSeqLen = maxSeqLen
    return preprocessor
  }

  async loadModelInformation(options: BotonicPluginNLUOptions): Promise<this> {
    for (const lang of this.languages) {
      this.modelInfo[lang] = {}
      this.modelInfo[lang].language = lang
      // Prepare model information promises to be waited in parallel
      const { model, modelData } = getModelInfoForEnv(lang) as any
      this.modelInfo[lang].model = model
      this.modelInfo[lang].modelData = modelData
    }
    await Promise.all([
      ...Object.values(this.modelInfo).map((info: any) => info.model),
      ...Object.values(this.modelInfo).map((info: any) => info.modelData),
    ])
    for (const [lang, res] of Object.entries(this.modelInfo) as any) {
      // Resolving previous promises
      this.modelInfo[lang].model = await res.model
      const modelData = (await res.modelData).data
      this.modelInfo[lang].modelData = modelData
      this.modelInfo[lang].preprocessor = this.initPreprocessor(
        options[lang],
        modelData.vocabulary,
        modelData.maxSeqLen
      )
    }
    return await this // eslint-disable-line @typescript-eslint/await-thenable
  }

  predict(input): Result {
    const lang = detectLang(input, this.languages)
    const { model, modelData } = this.modelInfo[lang]
    const tensor = inputToTensor(input, this.modelInfo[lang].preprocessor)
    const prediction = model.predict(tensor)
    const intent = predictionToIntent(prediction, modelData.intents, lang)
    return intent
  }
}
