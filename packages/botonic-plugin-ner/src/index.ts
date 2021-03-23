import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { ModelsRouter } from './model/models-router'
import { PluginOptions } from './types'

export default class BotonicPluginNER implements Plugin {
  private modelsRouter: ModelsRouter

  constructor(readonly options: PluginOptions) {
    // @ts-ignore
    return (async () => {
      this.modelsRouter = await new ModelsRouter(this.options.locales)
      return this
    })()
  }

  pre(request: PluginPreRequest): void {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const entities = this.modelsRouter.recognizeEntities(request.input.data)
        Object.assign(request.input, { entities })
      }
    } catch (e) {
      console.log('Cannot recognize entities', e)
    }
  }
  post(request: PluginPostRequest): void {}
}
