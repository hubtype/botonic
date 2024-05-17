import {
  HtEvent,
  HtEventFeedback,
  // HtEventFlow
} from './event-models'
import { HtEventBotAiModel } from './event-models/ht-event-bot-ai-model'
import { HtEventBotKeywordModel } from './event-models/ht-event-bot-keyword-model'
import { HtEventBotAiKnowledgeBase } from './event-models/ht-event-bot-knowledge-base'
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

    // case EventName.flow:
    //   return new HtEventFlow(htEventProps, requestData)

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
