import { EventAction, EventCustom, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventCustom extends HtEvent {
  custom_fields: Record<string, any>
  custom_sensitive_fields: Record<string, any>

  constructor(event: EventCustom, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.WebEvent
    this.action = EventAction.Custom
    this.custom_fields = event.customFields || {}
    this.custom_sensitive_fields = event.customSensitiveFields || {}
  }
}
