import {
  EventBotAiKnowledgeBase,
  EventDataBotAiKnowledgeBase,
  RequestData,
} from '../types'
import { BaseHtEventData, HtEvent } from './ht-event'

export class HtEventBotAiKnowledgeBase extends HtEvent {
  data: BaseHtEventData & EventDataBotAiKnowledgeBase

  constructor(event: EventBotAiKnowledgeBase, requestData: RequestData) {
    super(event, requestData)
    this.data.answer = event.data.answer
    this.data.knowledge_source_ids = event.data.knowledge_source_ids
  }
}
