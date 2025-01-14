import {
  EventAction,
  EventKnowledgeBase,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventKnowledgeBase extends HtEvent {
  knowledgebase_inference_id: string
  knowledgebase_fail_reason?: string
  knowledgebase_sources_ids: string[]
  knowledgebase_chunks_ids: string[]
  knowledgebase_message_id: string
  user_input: string
  flow_thread_id: string
  flow_id: string
  flow_node_id: string

  constructor(event: EventKnowledgeBase, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.Knowledgebase
    this.knowledgebase_inference_id = event.knowledgebaseInferenceId
    this.knowledgebase_fail_reason = event.knowledgebaseFailReason
    this.knowledgebase_sources_ids = event.knowledgebaseSourcesIds
    this.knowledgebase_chunks_ids = event.knowledgebaseChunksIds
    this.knowledgebase_message_id = event.knowledgebaseMessageId
    this.user_input = event.userInput
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_node_id = event.flowNodeId
  }
}
