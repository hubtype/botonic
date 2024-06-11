import { EventAction, EventFallback, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventFallback extends HtEvent {
  fallback_out: number
  fallback_message_id: string

  constructor(event: EventFallback, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.Fallback
    this.fallback_out = event.fallbackOut
    this.fallback_message_id = event.fallbackMessageId
  }
}
