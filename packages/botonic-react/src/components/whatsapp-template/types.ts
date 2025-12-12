export enum WhatsAppTemplateButtonSubType {
  URL = 'URL',
  QUICK_REPLY = 'QUICK_REPLY',
  PHONE_NUMBER = 'PHONE_NUMBER',
}

export enum WhatsAppTemplateParameterType {
  TEXT = 'TEXT',
  PAYLOAD = 'PAYLOAD',
}

export enum WhatsAppTemplateComponentType {
  HEADER = 'HEADER',
  BODY = 'BODY',
  FOOTER = 'FOOTER',
  BUTTONS = 'BUTTONS',
  BUTTON = 'BUTTON',
}

export enum WhatsAppTemplateComponentFormat {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  GIF = 'GIF',
}

export interface WhatsappTemplateHeader {
  type: WhatsAppTemplateComponentType.HEADER
  parameters: {
    type: WhatsAppTemplateParameterType.TEXT //| 'image' | 'video' | 'document'
    parameter_name: string
    text: string
  }[]
}

export interface WhatsappTemplateBody {
  type: WhatsAppTemplateComponentType.BODY
  parameters: {
    type: WhatsAppTemplateParameterType.TEXT
    parameter_name: string
    text: string
  }[]
}

export interface WhatsappTemplateFooter {
  type: WhatsAppTemplateComponentType.FOOTER
  parameters: {
    type: WhatsAppTemplateParameterType.TEXT
    parameter_name: string
    text: string
  }[]
}

export interface WhatsappTemplateQuickReplyButton {
  type: WhatsAppTemplateComponentType.BUTTON
  sub_type: WhatsAppTemplateButtonSubType.QUICK_REPLY
  index: number
  parameters: {
    type: WhatsAppTemplateParameterType.PAYLOAD
    payload: string
  }[]
}

export interface WhatsappTemplateUrlButton {
  type: WhatsAppTemplateComponentType.BUTTON
  sub_type: WhatsAppTemplateButtonSubType.URL
  index: number
  parameters: {
    type: WhatsAppTemplateParameterType.TEXT
    text: string // URL dynamic param
  }[]
}

export type WhatsappTemplateButton =
  | WhatsappTemplateQuickReplyButton
  | WhatsappTemplateUrlButton
