import {
  BaseEventData,
  EventBotAiKnowledgeBase,
  EventDataBotAiKnowledgeBase,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotAiKnowledgeBase extends HtEvent {
  event_data: BaseEventData & EventDataBotAiKnowledgeBase

  constructor(event: EventBotAiKnowledgeBase, requestData: RequestData) {
    super(event, requestData)
    this.event_data.answer = event.event_data.answer
    this.event_data.knowledge_source_ids = event.event_data.knowledge_source_ids
  }
}
