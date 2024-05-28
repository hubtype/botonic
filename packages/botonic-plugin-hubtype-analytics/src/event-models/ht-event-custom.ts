import {
  CUSTOM_PREFIX,
  EventAction,
  EventCustom,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

interface EventDataCustom {
  action: EventAction.customBot | EventAction.customWeb
}

export class HtEventCustom extends HtEvent {
  data: EventDataCustom

  constructor(event: EventCustom, requestData: RequestData) {
    super(event, requestData)
    this.type =
      event.action === EventAction.customBot
        ? EventType.botevent
        : EventType.webevent

    // Set in data with all attributs that start with 'custom_'
    for (const key in event.data) {
      if (key.startsWith(CUSTOM_PREFIX)) {
        this.data[key] = event.data[key]
      }
    }
  }
}
