import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { ModelHandler } from './model-handler'
import { BotonicPluginNLUOptions } from './types'

export default class BotonicPluginNLU implements Plugin {
  private modelHandler: ModelHandler
  constructor(options: BotonicPluginNLUOptions) {
    // @ts-ignore
    return (async () => {
      await this.init(options)
      return this
    })()
  }

  private async init(options: BotonicPluginNLUOptions): Promise<void> {
    this.modelHandler = await new ModelHandler(options) // eslint-disable-line @typescript-eslint/await-thenable
  }

  pre(request: PluginPreRequest): void {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const intent = this.modelHandler.predict(request.input.data)
        Object.assign(request.input, intent)
      }
    } catch (e) {
      console.log('Cannot predict the results', e)
    }
  }
  post(request: PluginPostRequest): void {}
}
