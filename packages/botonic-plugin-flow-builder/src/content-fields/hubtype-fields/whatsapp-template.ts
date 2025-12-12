import {
  WhatsAppTemplateButtonSubType,
  WhatsAppTemplateComponentFormat,
  WhatsAppTemplateComponentType,
} from '@botonic/react'

import { HtButton } from './button'
import { HtBaseNode } from './common'
import { HtNodeWithContentType } from './node-types'

type HtWhatsAppTemplateButton =
  | {
      type: WhatsAppTemplateButtonSubType.URL
      text: string
      url?: string
      index: number
    }
  | {
      type: WhatsAppTemplateButtonSubType.QUICK_REPLY
      text: string
      id: string
      index: number
    }
  | {
      type: WhatsAppTemplateButtonSubType.PHONE_NUMBER
      text: string
      phone_number: string
      index: number
    }

export interface HtWhatsAppTemplateHeaderComponent {
  type: WhatsAppTemplateComponentType.HEADER
  format: WhatsAppTemplateComponentFormat.TEXT
  text: string
}

export interface HtWhatsAppTemplateBodyComponent {
  type: WhatsAppTemplateComponentType.BODY
  text: string
}

export interface HtWhatsAppTemplateFooterComponent {
  type: WhatsAppTemplateComponentType.FOOTER
  text: string
}

export interface HtWhatsAppTemplateButtonsComponent {
  type: WhatsAppTemplateComponentType.BUTTONS
  buttons: HtWhatsAppTemplateButton[]
}
export type HtWhatsAppTemplateComponent =
  | HtWhatsAppTemplateHeaderComponent
  | HtWhatsAppTemplateBodyComponent
  | HtWhatsAppTemplateFooterComponent
  | HtWhatsAppTemplateButtonsComponent

export interface HtWhatsAppTemplate {
  id: string
  name: string
  language: string
  status: string
  category: string
  components: HtWhatsAppTemplateComponent[]
  namespace: string
  parameter_format: string
}
export interface HtWhatsappTemplateNode extends HtBaseNode {
  type: HtNodeWithContentType.WHATSAPP_TEMPLATE
  content: {
    template: HtWhatsAppTemplate
    variable_values: Record<string, string>
    // TODO: Should we store different variables for header, body and footer?
    // header_variables: Record<string, string>
    // body_variables: Record<string, string>
    // footer_variables: Record<string, string>
    // TODO: Should we store variables for dynamic urls buttons
    // url_variables: Record<string, string>
    // TODO: Should we store variables for quick reply buttons
    // quick_reply_variables: Record<string, string>
    // TODO: Should we store variables for phone number buttons
    // phone_number_variables: Record<string, string>
    buttons: HtButton[]
  }
}
