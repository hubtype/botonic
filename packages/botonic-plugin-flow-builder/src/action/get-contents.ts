import {
  type BotContext,
  INPUT,
  type Input,
  WhatsappInputOrigin,
} from '@botonic/core'
import { EMPTY_PAYLOAD } from '../constants'
import type { FlowContent } from '../content-fields'
import { inputHasTextOrTranscript } from '../utils/input'
import { getContentsByAiAgentFromUserInput } from './ai-agent-from-user-input'
import type { FlowBuilderContentsResult } from './contents-result'
import { getFlowBuilderActionContext } from './context'
import { getContentsByFallback } from './fallback'
import { getContentsByFirstInteraction } from './first-interaction'
import { getContentsByPayload } from './payload'

export type { FlowBuilderContentsResult } from './contents-result'

export async function getContents(
  botContext: BotContext,
  contentID?: string
): Promise<FlowBuilderContentsResult> {
  const context = getFlowBuilderActionContext(botContext, contentID)

  if (botContext.session.is_first_interaction) {
    return {
      contents: await getContentsByFirstInteraction(context),
    }
  }
  // TODO: Add needed logic when we can define contents for multi locale queue position message
  if (botContext.input.type === INPUT.EVENT_QUEUE_POSITION_CHANGED) {
    return { contents: [] }
  }

  if (botContext.input.payload?.startsWith(EMPTY_PAYLOAD)) {
    botContext.input.payload = undefined
  }

  if (botContext.input.payload || contentID) {
    const contentsByPayload = await getContentsByPayload(context)
    if (contentsByPayload.contents.length > 0) {
      return contentsByPayload
    }

    return {
      contents: await getContentsByFallback(context),
    }
  }

  if (
    inputHasTextOrTranscript(botContext.input) ||
    isContactRequested(botContext.input)
  ) {
    const aiAgentContents = await getContentsByAiAgentFromUserInput(context)
    if (aiAgentContents.length > 0) {
      return { contents: aiAgentContents }
    }
  }

  return {
    contents: await getContentsByFallback(context),
  }
}

function isContactRequested(input: Input) {
  return (
    input.type === INPUT.CONTACT &&
    input.origin === WhatsappInputOrigin.ContactRequest
  )
}
