import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import type { PluginOptions } from './types'

export default class BotonicPluginTextClassification implements Plugin {
  constructor(readonly options: PluginOptions) {}

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        //   TODO: Pending to be implemented.
      }
    } catch (e) {
      console.error(`Cannot classify the input: ${request.input}`)
    }
  }

  async post(request: PluginPostRequest): Promise<void> {}
}
