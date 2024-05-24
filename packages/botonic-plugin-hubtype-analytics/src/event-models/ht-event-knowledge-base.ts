import {
  EventAction,
  EventKnowledgeBase,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

interface EventDataKnowledgeBase {
  action: EventAction.knowledgebase
  knowledgebase_fail_reason?: string
  knowledgebase_sources_ids: string[]
  knowledgebase_chunks_ids: string[]
}

export class HtEventKnowledgeBase extends HtEvent {
  data: EventDataKnowledgeBase

  constructor(event: EventKnowledgeBase, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.botevent
    this.data.knowledgebase_fail_reason = event.data.knowledgebaseFailReason
    this.data.knowledgebase_sources_ids = event.data.knowledgebaseSourcesIds
    this.data.knowledgebase_chunks_ids = event.data.knowledgebaseChunksIds
  }
}
