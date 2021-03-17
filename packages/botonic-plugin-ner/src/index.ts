import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { ModelHandler } from './model/model-handler'
import { BotonicPluginNerOptions } from './types'

export default class BotonicPluginNER implements Plugin {
  private modelHandler: ModelHandler

  constructor(options: BotonicPluginNerOptions) {
    // @ts-ignore
    return (async () => {
      await this.init()
      return this
    })()
  }

  private async init(): Promise<void> {
    this.modelHandler = await new ModelHandler()
  }

  pre(request: PluginPreRequest): void {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const entities = this.modelHandler.recognizeEntities(request.input.data)
        Object.assign(request.input, entities)
      }
    } catch (e) {
      console.log('Cannot recognize entities', e)
    }
  }
  post(request: PluginPostRequest): void {}
}
