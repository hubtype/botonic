import { WithButtons } from './buttons'

export interface CarouselElement extends WithButtons {
  src: string
  title: string
  subtitle?: string
}
