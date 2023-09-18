import {
  BaseEventData,
  EventBotAiKnowladgeBase,
  EventDataBotAiKnowladgeBase,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotAiKnowledgeBase extends HtEvent {
  event_data: BaseEventData & EventDataBotAiKnowladgeBase

  constructor(event: EventBotAiKnowladgeBase, requestData: RequestData) {
    super(event, requestData)
    this.event_data.answer = event.event_data.answer
    this.event_data.knowledge_source_ids = event.event_data.knowledge_source_ids
  }
}
