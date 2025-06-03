import { BotContext } from '@botonic/core'

import { FlowContent } from '../content-fields'
import { ContentFilter } from '../types'

interface ContentFilterExecutorOptions {
  filters: ContentFilter[]
}

export class ContentFilterExecutor {
  private filters: ContentFilter[] = []

  constructor(options: ContentFilterExecutorOptions) {
    this.filters = options.filters
  }

  async filter(
    request: BotContext,
    content: FlowContent
  ): Promise<FlowContent> {
    for (const filter of this.filters) {
      content = await filter(request, content)
    }

    return content
  }
}
