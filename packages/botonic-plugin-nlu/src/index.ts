import { INPUT } from '@botonic/core'
import type { PluginPreRequest, PluginPostRequest } from '@botonic/core'
import { BotonicPluginNLUOptions } from './types'
import { ModelHandler } from './model-handler'

export default class BotonicPluginNLU {
  private nlu
  private constructor(options: BotonicPluginNLUOptions) {
    // @ts-ignore
    return (async () => {
      await this.init(options)
      return this
    })()
  }

  async init(options: BotonicPluginNLUOptions): Promise<void> {
    this.nlu = await new ModelHandler(options) // eslint-disable-line @typescript-eslint/await-thenable
  }

  pre(request: PluginPreRequest): PluginPreRequest {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const intent = this.nlu.predict(request.input.data)
        Object.assign(request.input, intent)
      }
    } catch (e) {
      console.log('Cannot predict the results', e)
    }
    return {
      input: request.input,
      session: request.session,
      lastRoutePath: request.lastRoutePath,
    }
  }
  async post(request: PluginPostRequest): Promise<void> {}
}
