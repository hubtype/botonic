import { WhatsappCTAUrlHeaderType } from '@botonic/react'

import { HtButton } from './button'
import { HtBaseNode, HtMediaFileLocale, HtTextLocale } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtWhatsappCTAUrlButtonNode extends HtBaseNode {
  type: HtNodeWithContentType.WHATSAPP_CTA_URL_BUTTON
  content: {
    text: HtTextLocale[]
    header: HtTextLocale[]
    header_type?: WhatsappCTAUrlHeaderType
    header_image?: HtMediaFileLocale[]
    header_video?: HtMediaFileLocale[]
    header_document?: HtMediaFileLocale[]
    footer: HtTextLocale[]
    button: HtButton
  }
}
