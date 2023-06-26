import { EventBotKeywordModel, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotKeywordModel extends HtEvent {
  confidence_successful: boolean

  constructor(event: EventBotKeywordModel, requestData: RequestData) {
    super(event, requestData)

    this.confidence_successful = event.event_data.confidence_successful
  }
}
