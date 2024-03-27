import { ActionRequest } from '@botonic/react'

import { getFlowBuilderPlugin } from './helpers'

export async function trackEvent(
  request: ActionRequest,
  eventName: EventName,
  args?: Record<string, any>
): Promise<void> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  if (flowBuilderPlugin.trackEvent) {
    await flowBuilderPlugin.trackEvent(request, eventName, args)
  }
  return
}

export enum EventName {
  botAgentRating = 'bot_agent_rating',
  botChannelRating = 'bot_channel_rating',
  botFaqUseful = 'bot_faq_useful',
  botRating = 'bot_rating',
  botFaq = 'bot_faq',
  botStart = 'bot_start',
  botOpen = 'bot_open',
  botAiModel = 'bot_ai_model',
  botAiKnowledgeBase = 'bot_ai_knowledge_base',
  botKeywordsModel = 'bot_keywords_model',
  fallback = 'fallback',
  handoffOption = 'handoff_option',
  handoffSuccess = 'handoff_success',
  handoffFail = 'handoff_fail',
}
