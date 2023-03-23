import { BotonicMessageEvent } from './message-event'

export interface ContactMessageEvent extends BotonicMessageEvent {
  phone_number: string
  first_name: string
  last_name: string
  vcard: any
}
