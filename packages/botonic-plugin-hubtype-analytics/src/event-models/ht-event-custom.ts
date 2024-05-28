import { EventAction, EventCustom, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataCustom {
  action: EventAction.custom
  custom_fields: Record<string, any>
}

export class HtEventCustom extends HtEvent {
  data: EventDataCustom

  constructor(event: EventCustom, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.webevent
    this.data.custom_fields = event.data.customFields
  }
}
