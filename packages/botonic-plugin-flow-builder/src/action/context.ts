import type { BotContext } from '@botonic/core'

import type { FlowBuilderApi } from '../api'
import { getFlowBuilderPlugin } from '../helpers'
import type BotonicPluginFlowBuilder from '../index'

export interface FlowBuilderContext {
  cmsApi: FlowBuilderApi
  flowBuilderPlugin: BotonicPluginFlowBuilder
  request: BotContext
  resolvedLocale: string
  contentID?: string
}

export function getFlowBuilderActionContext(
  request: BotContext,
  contentID?: string
): FlowBuilderContext {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const cmsApi = flowBuilderPlugin.cmsApi
  const resolvedLocale = flowBuilderPlugin.cmsApi.getResolvedLocale()
  return {
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
    contentID,
  }
}
