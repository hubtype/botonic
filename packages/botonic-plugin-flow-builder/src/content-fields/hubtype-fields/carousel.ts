import { HtButton } from './button'
import { HtBaseNode, HtMediaFileLocale, HtTextLocale } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtCarouselElement {
  id: string
  title: HtTextLocale[]
  subtitle: HtTextLocale[]
  image: HtMediaFileLocale[]
  button: HtButton
}

export interface HtCarouselNode extends HtBaseNode {
  type: HtNodeWithContentType.CAROUSEL
  content: {
    whatsapp_text: HtTextLocale[]
    elements: HtCarouselElement[]
  }
}
