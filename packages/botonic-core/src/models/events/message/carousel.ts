import { BotonicMessageEvent, MessageEventType } from '.'
import { CarouselElement } from './element'

export interface CarouselMessageEvent
  extends BotonicMessageEvent<MessageEventType.carousel> {
  type: MessageEventType.carousel
  elements: CarouselElement[]
}
