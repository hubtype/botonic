import { HtButton } from './button'
import { HtBaseNode, HtTextLocale } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtWhatsappCTAUrlButtonNode extends HtBaseNode {
  type: HtNodeWithContentType.WHATSAPP_CTA_URL_BUTTON
  content: {
    text: HtTextLocale[]
    header: HtTextLocale[]
    footer: HtTextLocale[]
    button: HtButton
  }
}
