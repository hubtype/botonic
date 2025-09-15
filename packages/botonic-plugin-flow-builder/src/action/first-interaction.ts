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
  const { contentID, flowBuilderPlugin, request } = context

  /*
   * If the contentID is provided, the firstInteractionContents are obtained even if they are not used
   * because when obtain this firstInteractionContents is when the session.flow_thread_id is updated.
   * This is needed for example when send a WhatsApp campaign is sent,
   * the bot not receives the message because this message is sent directly by the backend
   * we expect the bot to respond only with the contents of the contentID and not with the firstInteractionContents.
   */
  const firstInteractionContents = await flowBuilderPlugin.getStartContents()

  if (contentID) {
    try {
      const contentsByContentID =
        await flowBuilderPlugin.getContentsByContentID(contentID)

      if (contentsByContentID.length > 0) {
        return contentsByContentID
      }
    } catch (error) {
      console.warn(
        `The contentID ${contentID} is not found. Returning the firstInteractionContents`
      )
    }
  }

  /* If the first interaction has a FlowBotAction, it should be the last content
   * and avoid to render the match with keywords,intents or knowledge base
   */
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
  contentsByKeywordsOrIntents: FlowContent[]
) {
  const startContents = await flowBuilderPlugin.getStartContents()
  const contentIds = new Set(
    contentsByKeywordsOrIntents.map(content => content.id)
  )
  const hasRepeatedContent = startContents.some(content =>
    contentIds.has(content.id)
  )

  return hasRepeatedContent
}
