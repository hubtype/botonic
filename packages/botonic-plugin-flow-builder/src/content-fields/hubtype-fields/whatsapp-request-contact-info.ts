import type { HtBaseNode, HtTextLocale } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtWhatsappRequestContactInfoNode extends HtBaseNode {
  type: HtNodeWithContentType.WHATSAPP_REQUEST_CONTACT_INFO
  content: {
    text: HtTextLocale[]
  }
}
