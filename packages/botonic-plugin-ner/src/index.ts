import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { NamedEntityRecognizer } from './model/ner'
import { PluginOptions } from './types'
import { detectLocale } from './utils/locale-utils'

export default class BotonicPluginNER implements Plugin {
  private recognizers: { [locale: string]: NamedEntityRecognizer } = {}

  constructor(readonly options: PluginOptions) {
    // @ts-ignore
    return (async () => {
      await this.init()
      return this
    })()
  }

  async init(): Promise<void> {
    this.options.locales.forEach(async locale => {
      this.recognizers[locale] = await new NamedEntityRecognizer(locale)
    })
  }

  pre(request: PluginPreRequest): void {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const locale = detectLocale(request.input.data, this.options.locales)
        const ner = this.recognizers[locale]
        if (!ner) {
          throw new Error('NER Model not ready.')
        }
        const entities = ner.recognize(request.input.data)
        Object.assign(request.input, { entities })
      }
    } catch (e) {
      console.log('Cannot recognize entities', e)
    }
  }
  post(request: PluginPostRequest): void {}
}
