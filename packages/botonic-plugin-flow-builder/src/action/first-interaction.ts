import type { FlowBuilderApi } from '../api'
import { MAIN_FLOW_NAME } from '../constants'
import {
  FlowAiAgent,
  FlowAiAgentRouter,
  FlowBotAction,
  type FlowContent,
} from '../content-fields'
import type BotonicPluginFlowBuilder from '../index'
import { inputHasTextOrTranscript } from '../utils/input'
import { getContentsByAiAgentFromUserInput } from './ai-agent-from-user-input'
import type { FlowBuilderContext } from './context'
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
    } catch (_error) {
      console.warn(
        `The contentID ${contentID} is not found. Returning the firstInteractionContents`
      )
    }
  }

  // Bot actions and AI agents already consume the user input. Matching
  // keywords/intents/KB/AI-agent-from-user-input on top would duplicate replies
  // (e.g. Main start → Go to flow → AI Agents).
  if (startContentsAlreadyHandleUserInput(firstInteractionContents)) {
    return firstInteractionContents
  }

  if (request.input.nluResolution || inputHasTextOrTranscript(request.input)) {
    const contentsByUserInput = await getContentsByUserInput(context)

    return [...firstInteractionContents, ...contentsByUserInput]
  }

  return firstInteractionContents
}

function startContentsAlreadyHandleUserInput(contents: FlowContent[]): boolean {
  if (contents.at(-1) instanceof FlowBotAction) {
    return true
  }

  // To avoid duplicated ai agent response, we check if there is an ai agent or ai agent router in the first interaction contents.
  return contents.some(
    content =>
      content instanceof FlowAiAgent || content instanceof FlowAiAgentRouter
  )
}

async function getContentsByUserInput(
  context: FlowBuilderContext
): Promise<FlowContent[]> {
  const { cmsApi, flowBuilderPlugin, request, resolvedLocale } = context
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

  if (!flowBuilderPlugin.disableAIAgentInFirstInteraction) {
    const contentsByAiAgent = await getContentsByAiAgentFromUserInput(context)
    return contentsByAiAgent
  }

  return []
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
