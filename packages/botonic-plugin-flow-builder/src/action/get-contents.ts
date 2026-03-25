import { type BotContext, INPUT } from '@botonic/core'
import { EMPTY_PAYLOAD } from '../constants'
import type { FlowContent } from '../content-fields'
import { inputHasTextOrTranscript } from '../utils'
import { getContentsByAiAgentFromUserInput } from './ai-agent-from-user-input'
import { getFlowBuilderActionContext } from './context'
import { getContentsByFallback } from './fallback'
import { getContentsByFirstInteraction } from './first-interaction'
import { getContentsByKnowledgeBase } from './knowledge-bases'
import { getContentsByPayload } from './payload'

export async function getContents(
  botContext: BotContext,
  contentID?: string
): Promise<FlowContent[]> {
  const context = getFlowBuilderActionContext(botContext, contentID)

  if (botContext.session.is_first_interaction) {
    return await getContentsByFirstInteraction(context)
  }
  // TODO: Add needed logic when we can define contents for multi locale queue position message
  if (botContext.input.type === INPUT.EVENT_QUEUE_POSITION_CHANGED) {
    return []
  }

  if (botContext.input.payload?.startsWith(EMPTY_PAYLOAD)) {
    botContext.input.payload = undefined
  }

  if (botContext.input.payload || contentID) {
    const contentsByPayload = await getContentsByPayload(context)
    if (contentsByPayload.length > 0) {
      return contentsByPayload
    }

    return await getContentsByFallback(context)
  }

  if (inputHasTextOrTranscript(botContext.input)) {
    const aiAgentContents = await getContentsByAiAgentFromUserInput(context)
    if (aiAgentContents.length > 0) {
      return aiAgentContents
    }
    const knowledgeBaseContents = await getContentsByKnowledgeBase(context)
    if (knowledgeBaseContents.length > 0) {
      return knowledgeBaseContents
    }
  }

  return await getContentsByFallback(context)
}
