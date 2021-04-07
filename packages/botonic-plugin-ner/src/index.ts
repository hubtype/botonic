import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { ModelSelector } from './model/model-selector'
import { PluginOptions } from './types'
import { detectLocale } from './utils/locale-utils'

export default class BotonicPluginNER implements Plugin {
  private modelsSelector: Promise<ModelSelector>

  constructor(readonly options: PluginOptions) {
    this.modelsSelector = ModelSelector.build(this.options.locales)
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
