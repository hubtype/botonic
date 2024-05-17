import { HtEvent } from './event-models/ht-event'
import { HtEventAgentRating } from './event-models/ht-event-agent-rating'
import { HtEventBotAiModel } from './event-models/ht-event-bot-ai-model'
import { HtEventBotFaq } from './event-models/ht-event-bot-faq'
import { HtEventBotKeywordModel } from './event-models/ht-event-bot-keyword-model'
import { HtEventBotAiKnowledgeBase } from './event-models/ht-event-bot-knowledge-base'
import { HtEventBotRating } from './event-models/ht-event-bot-rating'
import { HtEventChannelRating } from './event-models/ht-event-channel-rating'
import { HtEventFaqUseful } from './event-models/ht-event-faq-useful'
import { HtEventHandoffFail } from './event-models/ht-event-handoff-fail'
import { HtEventHandoffSuccess } from './event-models/ht-event-handoff-success'
import { EventName, HtEventProps, RequestData } from './types'

export function createHtEvent(
  requestData: RequestData,
  htEventProps: HtEventProps
): HtEvent {
  switch (htEventProps.type) {
    case EventName.feedback:
      return new HtEventFeedback(htEventProps, requestData)

    case EventName.botFaqUseful:
      return new HtEventFaqUseful(htEventProps, requestData)

    case EventName.botRating:
      return new HtEventBotRating(htEventProps, requestData)

    case EventName.botFaq:
      return new HtEventBotFaq(htEventProps, requestData)

    case EventName.botAiModel:
      return new HtEventBotAiModel(htEventProps, requestData)

    case EventName.botAiKnowledgeBase:
      return new HtEventBotAiKnowledgeBase(htEventProps, requestData)

    case EventName.botKeywordsModel:
      return new HtEventBotKeywordModel(htEventProps, requestData)

    case EventName.handoffSuccess:
      return new HtEventHandoffSuccess(htEventProps, requestData)

    case EventName.handoffFail:
      return new HtEventHandoffFail(htEventProps, requestData)

    default:
      return new HtEvent(htEventProps, requestData)
  }
}
