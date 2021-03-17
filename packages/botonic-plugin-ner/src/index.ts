import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { ModelHandler } from './model/model-handler'
import { PluginOptions } from './types'

export default class BotonicPluginNER implements Plugin {
  private modelHandler: ModelHandler

  constructor(options: PluginOptions) {
    // @ts-ignore
    return (async () => {
      await this.init(options)
      return this
    })()
  }

  private async init(options: PluginOptions): Promise<void> {
    this.modelHandler = await new ModelHandler(options)
  }

  pre(request: PluginPreRequest): void {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const entities = this.modelHandler.recognizeEntities(request.input.data)
        console.log(entities)
        Object.assign(request.input, entities)
      }
    } catch (e) {
      console.log('Cannot recognize entities', e)
    }
  }
  post(request: PluginPostRequest): void {}
}
