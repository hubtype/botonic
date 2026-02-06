import type {
  WhatsAppTemplateButtonSubType,
  WhatsAppTemplateComponentType,
  WhatsAppTemplateParameterType,
} from '@botonic/react'

import type { HtButton } from './button'
import type { HtBaseNode, HtMediaFileLocale } from './common'
import type { HtNodeWithContentType } from './node-types'

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
  format:
    | WhatsAppTemplateParameterType.TEXT
    | WhatsAppTemplateParameterType.IMAGE
    | WhatsAppTemplateParameterType.VIDEO
  text?: string
  image?: { link: string }
  video?: { link: string }
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
    header_variables?: {
      type: WhatsAppTemplateParameterType
      text?: Record<string, string>
      media?: HtMediaFileLocale[]
    }
    variable_values: Record<string, string>

    buttons: HtButton[]
    url_variable_values?: Record<string, string>
  }
}
