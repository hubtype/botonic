import {
  EventAction,
  type EventKeyword,
  EventType,
  type RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventKeyword extends HtEvent {
  nlu_keyword_name: string
  nlu_keyword_is_regex: boolean
  nlu_keyword_message_id: string
  user_input: string
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string

  constructor(event: EventKeyword, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.Keyword
    this.nlu_keyword_name = event.nluKeywordName
    this.nlu_keyword_is_regex = event.nluKeywordIsRegex || false
    this.nlu_keyword_message_id = event.nluKeywordMessageId
    this.user_input = event.userInput
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
  }
}
