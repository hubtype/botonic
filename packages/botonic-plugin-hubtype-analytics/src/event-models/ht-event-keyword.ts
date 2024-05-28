import { EventAction, EventKeyword, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataKeyword {
  action: EventAction.keyword
  nlu_keyword_id: string
  nlu_keyword_name: string
  nlu_keyword_is_regex: boolean
  nlu_keyword_message_id: string
}

export class HtEventKeyword extends HtEvent {
  data: EventDataKeyword

  constructor(event: EventKeyword, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.botevent
    this.data.nlu_keyword_id = event.data.nluKeywordId
    this.data.nlu_keyword_name = event.data.nluKeywordName
    this.data.nlu_keyword_is_regex = event.data.nluKeywordIsRegex || false
    this.data.nlu_keyword_message_id = event.data.nluKeywordMessageId
  }
}
