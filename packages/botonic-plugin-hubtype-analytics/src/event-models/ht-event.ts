import { BaseEventData, EventName, HtEventProps, RequestData } from '../types'
import { HtEventAgentRating } from './ht-event-agent-rating'
import { HtEventBotAiModel } from './ht-event-bot-ai-model'
import { HtEventBotFaq } from './ht-event-bot-faq'
import { HtEventBotKeywordModel } from './ht-event-bot-keyword-model'
import { HtEventBotRating } from './ht-event-bot-rating'
import { HtEventChannelRating } from './ht-event-channel-rating'
import { HtEventFaqUseful } from './ht-event-faq-useful'
import { HtEventHandoffFail } from './ht-event-handoff-fail'
import { HtEventHandoffSuccess } from './ht-event-handoff-success'

export class HtEvent {
  chat: string
  event_type: EventName
  event_data: BaseEventData

  protected constructor(event: HtEventProps, requestData: RequestData) {
    this.chat = requestData.userId
    this.event_type = event.event_type
    this.event_data = {
      channel: requestData.provider,
      event_datetime: new Date().toISOString(),
      enduser_language: requestData.language,
      enduser_country: requestData.country,
      format_version: 1,
      // flow_version?: string
    }
  }

  static create(requestData: RequestData, htEventProps: HtEventProps): HtEvent {
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
}
