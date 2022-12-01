import { BotonicMessageEvent } from './message-event'

export interface FormMessageEvent extends BotonicMessageEvent {
  form_title: string
  form_answers: any
}
