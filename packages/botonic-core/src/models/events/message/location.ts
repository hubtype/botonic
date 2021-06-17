import { BotonicMessageEvent, MessageEventType } from '.'

export interface LocationMessageEvent
  extends BotonicMessageEvent<MessageEventType.location> {
  lat: number
  long: number
}
