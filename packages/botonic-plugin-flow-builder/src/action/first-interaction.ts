import { FlowBuilderApi } from '../api'
import { MAIN_FLOW_NAME } from '../constants'
import { FlowBotAction, FlowContent } from '../content-fields'
import BotonicPluginFlowBuilder from '../index'
import { getNodeByUserInput } from '../user-input'
import { inputHasTextData } from '../utils'
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

  // If the first interaction has a FlowBotAction, it should be the last content
  // and avoid to render the match with keywords,intents or knowledge base
  if (firstInteractionContents.at(-1) instanceof FlowBotAction) {
    return firstInteractionContents
  }

  if (inputHasTextData(request.input)) {
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
  const conversationStartId = getConversationStartId(cmsApi)

  if (request.input.payload === conversationStartId) {
    return []
  }

  const contentsByKeywordsOrIntents = await getContentsByPayload({
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
  })

  const hasRepeatedContent = await checkRepetedContents(
    flowBuilderPlugin,
    resolvedLocale,
    contentsByKeywordsOrIntents
  )

  if (hasRepeatedContent) {
    return []
  }

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

function getConversationStartId(cmsApi: FlowBuilderApi) {
  const conversationStartId = cmsApi.flow.flows.find(
    flow => flow.name === MAIN_FLOW_NAME
  )?.start_node_id

  return conversationStartId
}

async function checkRepetedContents(
  flowBuilderPlugin: BotonicPluginFlowBuilder,
  resolvedLocale: string,
  contentsByKeywordsOrIntents: FlowContent[]
) {
  const startContents = await flowBuilderPlugin.getStartContents(resolvedLocale)
  const contentIds = new Set(
    contentsByKeywordsOrIntents.map(content => content.id)
  )
  const hasRepeatedContent = startContents.some(content =>
    contentIds.has(content.id)
  )

  return hasRepeatedContent
}
