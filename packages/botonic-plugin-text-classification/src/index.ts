import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import type { PluginOptions } from './types'

export default class BotonicPluginTextClassification implements Plugin {
  constructor(readonly options: PluginOptions) {}

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        //   Pending to be implemented.
      }
    } catch (e) {
      console.log('Cannot classify the input text')
    }
  }

  async post(request: PluginPostRequest): Promise<void> {}
}
