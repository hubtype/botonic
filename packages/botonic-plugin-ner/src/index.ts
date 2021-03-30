import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { ModelsRouter } from './model/models-router'
import { PluginOptions } from './types'

export default class BotonicPluginNER implements Plugin {
  private modelsRouter: Promise<ModelsRouter>

  constructor(readonly options: PluginOptions) {
    this.modelsRouter = ModelsRouter.build(this.options.locales)
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const entities = (await this.modelsRouter).recognizeEntities(
          request.input.data
        )
        Object.assign(request.input, { entities })
      }
    } catch (e) {
      console.log('Cannot recognize entities', e)
    }
  }
  post(request: PluginPostRequest): void {}
}
