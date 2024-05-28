import { EventAction, EventFallback, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataFallback {
  action: EventAction.fallback
  fallback_out: number
  fallback_message_id: string
}

export class HtEventFallback extends HtEvent {
  data: EventDataFallback

  constructor(event: EventFallback, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.botevent
    this.data.fallback_out = event.data.fallbackOut
    this.data.fallback_message_id = event.data.fallbackMessageId
  }
}
