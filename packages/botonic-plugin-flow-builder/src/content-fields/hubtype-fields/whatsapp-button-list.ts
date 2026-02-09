/* eslint-disable @typescript-eslint/naming-convention */
import type { HtBaseNode, HtNodeLink, HtTextLocale } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtWhatsappButtonListRow {
  id: string
  text: HtTextLocale[]
  description: HtTextLocale[]
  target?: HtNodeLink
}

export interface HtWhatsappButtonListSection {
  id: string
  title: HtTextLocale[]
  rows: HtWhatsappButtonListRow[]
}

export interface HtWhatsappButtonListNode extends HtBaseNode {
  type: HtNodeWithContentType.WHATSAPP_BUTTON_LIST
  content: {
    text: HtTextLocale[]
    button_text: HtTextLocale[]
    sections: HtWhatsappButtonListSection[]
  }
}
