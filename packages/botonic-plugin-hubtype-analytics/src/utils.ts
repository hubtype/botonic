import { HtEvent } from './event-models/ht-event'
import { HtEventAgentRating } from './event-models/ht-event-agent-rating'
import { HtEventBotAiModel } from './event-models/ht-event-bot-ai-model'
import { HtEventBotFaq } from './event-models/ht-event-bot-faq'
import { HtEventBotKeywordModel } from './event-models/ht-event-bot-keyword-model'
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
  if (htEventProps.event_type === EventName.botAgentRating) {
    return new HtEventAgentRating(htEventProps, requestData)
  }
  if (htEventProps.event_type === EventName.botChannelRating) {
    return new HtEventChannelRating(htEventProps, requestData)
  }
  if (htEventProps.event_type === EventName.botFaqUseful) {
    return new HtEventFaqUseful(htEventProps, requestData)
  }
  if (htEventProps.event_type === EventName.botRating) {
    return new HtEventBotRating(htEventProps, requestData)
  }
  if (htEventProps.event_type === EventName.botFaq) {
    return new HtEventBotFaq(htEventProps, requestData)
  }
  if (htEventProps.event_type === EventName.botAiModel) {
    return new HtEventBotAiModel(htEventProps, requestData)
  }
  if (htEventProps.event_type === EventName.botKeywordsModel) {
    return new HtEventBotKeywordModel(htEventProps, requestData)
  }
  if (htEventProps.event_type === EventName.handoffSuccess) {
    return new HtEventHandoffSuccess(htEventProps, requestData)
  }
  if (htEventProps.event_type === EventName.handoffFail) {
    return new HtEventHandoffFail(htEventProps, requestData)
  }

  return new HtEvent(htEventProps, requestData)
}
