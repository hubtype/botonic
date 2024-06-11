import { EventAction, EventKeyword, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventKeyword extends HtEvent {
  nlu_keyword_id: string
  nlu_keyword_name: string
  nlu_keyword_is_regex: boolean
  nlu_keyword_message_id: string
  user_input?: string

  constructor(event: EventKeyword, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.Keyword
    this.nlu_keyword_id = event.nluKeywordId
    this.nlu_keyword_name = event.nluKeywordName
    this.nlu_keyword_is_regex = event.nluKeywordIsRegex || false
    this.nlu_keyword_message_id = event.nluKeywordMessageId
    this.user_input = event.userInput
  }
}
