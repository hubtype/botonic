import { WithButtons } from './buttons'
import { BotonicMessageEvent, MessageEventTypes } from './message-event'

export interface CarouselElement extends WithButtons {
  pic: string
  title: string
  subtitle?: string
}

export interface CarouselMessageEvent extends BotonicMessageEvent {
  type: MessageEventTypes.CAROUSEL
  elements: CarouselElement[]
}
