import { BotonicMessageEvent, MessageEventTypes } from './message-event'

export interface LocationMessageEvent extends BotonicMessageEvent {
  type: MessageEventTypes.LOCATION
  lat: number
  long: number
}
