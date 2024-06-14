import { INPUT } from '@botonic/core'

import { BOT_ACTION_PAYLOAD_PREFIX, MAIN_FLOW_NAME } from '../constants'
import { FlowContent } from '../content-fields'
import { getNodeByUserInput } from '../user-input'
import { FlowBuilderContext } from './index'
import { getContentsByKnowledgeBase } from './knowledge-bases'
import { getContentsByPayload } from './payload'

export async function getContentsByFirstInteraction({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const firstInteractionContents =
    await flowBuilderPlugin.getStartContents(resolvedLocale)

  if (request.input.data && request.input.type === INPUT.TEXT) {
    const contentsByUserInput = await getContentsByUserInput({
      cmsApi,
      flowBuilderPlugin,
      request,
      resolvedLocale,
    })

    return [...firstInteractionContents, ...contentsByUserInput]
  }

  return firstInteractionContents
}

async function getContentsByUserInput({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const nodeByUserInput = await getNodeByUserInput(
    cmsApi,
    resolvedLocale,
    request,
    flowBuilderPlugin.smartIntentsConfig
  )

  request.input.payload = cmsApi.getPayload(nodeByUserInput?.target)
  const conversationStartId = cmsApi.flow.flows.find(
    flow => flow.name === MAIN_FLOW_NAME
  )?.start_node_id

  if (request.input.payload === conversationStartId) {
    return []
  }

  if (request.input.payload?.startsWith(BOT_ACTION_PAYLOAD_PREFIX)) {
    request.input.payload = flowBuilderPlugin.replaceBotActionPayload(
      request.input.payload
    )
  }

  const contentsByKeywordsOrIntents = await getContentsByPayload({
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
  })

  if (contentsByKeywordsOrIntents.length > 0) {
    return contentsByKeywordsOrIntents
  }

  return await getContentsByKnowledgeBase({
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
  })
}
