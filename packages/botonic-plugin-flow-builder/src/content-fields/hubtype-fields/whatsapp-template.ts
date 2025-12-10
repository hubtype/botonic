import { HtBaseNode } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtWhatsappTemplateNode extends HtBaseNode {
  type: HtNodeWithContentType.WHATSAPP_TEMPLATE
  content: {
    template_name: string
    template_language: string
  }
}
