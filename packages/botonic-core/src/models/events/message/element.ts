import { WithButtons } from './buttons'

export interface CarouselElement extends WithButtons {
  pic: string
  title: string
  subtitle?: string
}
