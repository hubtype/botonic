import {
  EventBotKeywordModel,
  EventDataBotKeywordModel,
  RequestData,
} from '../types'
import { BaseHtEventData, HtEvent } from './ht-event'

export class HtEventBotKeywordModel extends HtEvent {
  data: BaseHtEventData & EventDataBotKeywordModel

  constructor(event: EventBotKeywordModel, requestData: RequestData) {
    super(event, requestData)
    this.data.confidence_successful = event.data.confidence_successful
  }
}
