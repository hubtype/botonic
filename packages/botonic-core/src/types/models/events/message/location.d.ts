import { BotonicMessageEvent, MessageEventTypes } from '.'
export interface LocationMessageEvent extends BotonicMessageEvent {
  type: MessageEventTypes.LOCATION
  lat: number
  long: number
}
