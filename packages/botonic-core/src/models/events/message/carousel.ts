import { BotonicMessageEvent, MessageEventTypes } from '.'
import { CarouselElement } from './element'

export interface CarouselMessageEvent extends BotonicMessageEvent {
  type: MessageEventTypes.CAROUSEL
  elements: CarouselElement[]
}
