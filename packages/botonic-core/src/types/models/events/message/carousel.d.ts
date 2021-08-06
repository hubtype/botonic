import { BotonicMessageEvent, MessageEventTypes } from '.'
import { WithButtons } from './buttons'
export interface CarouselElement extends WithButtons {
  pic: string
  title: string
  subtitle?: string
}
export interface CarouselMessageEvent extends BotonicMessageEvent {
  type: MessageEventTypes.CAROUSEL
  elements: CarouselElement[]
}
