import { EventKnowledgeBase, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataKnowledgeBase {
  knowledgebase_id: string
  knowledgebase_fail_reason: string
  knowledgebase_sources_ids: string[]
  knowledgebase_chunks_ids: string[]
}

export class HtEventKnowledgeBase extends HtEvent {
  data: EventDataKnowledgeBase

  constructor(event: EventKnowledgeBase, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.flow
    this.data.knowledgebase_id = event.data.knowledgebaseId
    this.data.knowledgebase_fail_reason = event.data.knowledgebaseFailReason
    this.data.knowledgebase_sources_ids = event.data.knowledgebaseSourcesIds
    this.data.knowledgebase_chunks_ids = event.data.knowledgebaseChunksIds
  }
}
