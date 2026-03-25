import type { BotContext } from '@botonic/core'

import type { FlowContent } from '../content-fields'
import { getFlowBuilderPlugin } from '../helpers'
import type { ContentFilter } from '../types'

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

export async function filterContents(
  request: BotContext,
  contents: FlowContent[]
): Promise<FlowContent[]> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const contentFilters = flowBuilderPlugin.contentFilters
  const contentFilterExecutor = new ContentFilterExecutor({
    filters: contentFilters,
  })

  const filteredContents: FlowContent[] = []
  for (const content of contents) {
    const filteredContent = await contentFilterExecutor.filter(request, content)
    filteredContents.push(filteredContent)
  }

  return filteredContents
}
