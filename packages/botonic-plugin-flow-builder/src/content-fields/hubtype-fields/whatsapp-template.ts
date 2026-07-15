import type {
  WhatsAppTemplateButtonSubType,
  WhatsAppTemplateComponentType,
  WhatsAppTemplateParameterType,
} from '@botonic/react'

import type { HtButton } from './button'
import type { HtBaseNode, HtMediaFileLocale } from './common'
import type { HtNodeWithContentType } from './node-types'

export enum HtWhatsAppTemplateFlowActionType {
  NAVIGATE = 'navigate',
  DATA_EXCHANGE = 'data_exchange',
}

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
  | {
      type: WhatsAppTemplateButtonSubType.VOICE_CALL
      text: string
      index: number
    }
  | {
      type: WhatsAppTemplateButtonSubType.FLOW
      text: string
      flow_id: string
      flow_action?: HtWhatsAppTemplateFlowActionType
      navigate_screen?: string
      index: number
    }

export interface HtFlowButtonActionValue {
  flow_token: string
  flow_action_data?: Record<string, string>
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

export interface HtWhatsappTemplateContentByLocale {
  template?: HtWhatsAppTemplate
  header_variables?: {
    type: WhatsAppTemplateParameterType
    text?: Record<string, string>
    media?: HtMediaFileLocale[]
  }
  variable_values?: Record<string, string>
  url_variable_values?: Record<string, string>
  flow_button_action_values?: Record<string, HtFlowButtonActionValue>
}

export interface HtWhatsappTemplateNode extends HtBaseNode {
  type: HtNodeWithContentType.WHATSAPP_TEMPLATE
  content: {
    by_locale: Record<string, HtWhatsappTemplateContentByLocale>
    buttons: HtButton[]
  }
}
