import { EventAction, EventFallback, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataFallback {
  action: EventAction.fallback
  fallback_attempt: number
}

export class HtEventFallback extends HtEvent {
  data: EventDataFallback

  constructor(event: EventFallback, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.botevent
    this.data.fallback_attempt = event.data.fallbackAttempt
  }
}
