import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'
import { Locale } from '@botonic/nlp'

import { NerModelSelector } from './model/model-selector'
import { PluginOptions } from './options'

export default class BotonicPluginNER implements Plugin {
  private modelsSelector: Promise<NerModelSelector>

  constructor(readonly options: PluginOptions) {
    this.modelsSelector = NerModelSelector.build(this.options.locales)
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      const language = request.input.language || request.session.__locale
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const inputText = request.input.data
        const ner = (await this.modelsSelector).select(language as Locale)
        const entities = ner.recognize(inputText)
        Object.assign(request.input, { entities })
      }
    } catch (e) {
      console.log('Cannot recognize entities', e)
    }
  }

  post(request: PluginPostRequest): void {}
}
