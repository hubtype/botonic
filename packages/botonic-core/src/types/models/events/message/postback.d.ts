import { BotonicMessageEvent } from '.'
export interface PostbackMessageEvent extends BotonicMessageEvent {
  payload: string
}
