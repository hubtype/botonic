import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { ModelSelector } from './model/model-selector'
import type { PluginOptions } from './options'
import { detectLocale } from './utils/locale-utils'

export default class BotonicPluginIntentClassification implements Plugin {
  private readonly modelsSelector: Promise<ModelSelector>

  constructor(readonly options: PluginOptions) {
    this.modelsSelector = ModelSelector.build(
      this.options.locales,
      this.options.modelsBaseUrl
    )
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const inputText = request.input.data
        const detectedLocale = detectLocale(inputText, this.options.locales)
        const classifier = (await this.modelsSelector).select(detectedLocale)
        const intents = classifier.classify(inputText)
        Object.assign(request.input, { intent: intents[0].label, intents })
      }
    } catch (e) {
      console.error(`Cannot classify the input: ${request.input}`, e)
    }
  }

  async post(request: PluginPostRequest): Promise<void> {}
}
