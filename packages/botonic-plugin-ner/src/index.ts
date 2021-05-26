import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { NerModelSelector } from './model/model-selector'
import { PluginOptions } from './options'
import { detectLocale } from './utils/locale-utils'

export default class BotonicPluginNER implements Plugin {
  private modelsSelector: Promise<NerModelSelector>

  constructor(readonly options: PluginOptions) {
    this.modelsSelector = NerModelSelector.build(
      this.options.locales,
      this.options.modelsBaseUrl
    )
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const inputText = request.input.data
        const detectedLocale = detectLocale(inputText, this.options.locales)
        const ner = (await this.modelsSelector).select(detectedLocale)
        const entities = ner.recognize(inputText)
        Object.assign(request.input, { entities })
      }
    } catch (e) {
      console.log('Cannot recognize entities', e)
    }
  }

  post(request: PluginPostRequest): void {}
}
