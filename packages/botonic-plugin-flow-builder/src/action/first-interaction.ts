import { FlowBuilderApi } from '../api'
import { MAIN_FLOW_NAME } from '../constants'
import { FlowBotAction, FlowContent } from '../content-fields'
import BotonicPluginFlowBuilder from '../index'
import { inputHasTextData } from '../utils'
import { FlowBuilderContext } from './index'
import { getContentsByKnowledgeBase } from './knowledge-bases'
import { getContentsByPayload } from './payload'

export async function getContentsByFirstInteraction(
  context: FlowBuilderContext
): Promise<FlowContent[]> {
  const { flowBuilderPlugin, request, resolvedLocale } = context
  const firstInteractionContents =
    await flowBuilderPlugin.getStartContents(resolvedLocale)

  // If the first interaction has a FlowBotAction, it should be the last content
  // and avoid to render the match with keywords,intents or knowledge base
  if (firstInteractionContents.at(-1) instanceof FlowBotAction) {
    return firstInteractionContents
  }

  if (request.input.nluResolution || inputHasTextData(request.input)) {
    const contentsByUserInput = await getContentsByUserInput(context)

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
  const payloadByNlu = request.input.nluResolution?.payload

  if (payloadByNlu) {
    request.input.payload = payloadByNlu
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

    const hasRepeatedContent = await checkRepeatedContents(
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

async function checkRepeatedContents(
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
