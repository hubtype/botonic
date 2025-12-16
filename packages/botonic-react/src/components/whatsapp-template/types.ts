export enum WhatsAppTemplateButtonSubType {
  URL = 'URL',
  QUICK_REPLY = 'QUICK_REPLY',
  PHONE_NUMBER = 'PHONE_NUMBER',
}

export enum WhatsAppTemplateParameterType {
  PAYLOAD = 'PAYLOAD',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export enum WhatsAppTemplateComponentType {
  HEADER = 'HEADER',
  BODY = 'BODY',
  FOOTER = 'FOOTER',
  BUTTONS = 'BUTTONS',
  BUTTON = 'BUTTON',
}

export interface WhatsappTemplateHeaderTextParameter {
  type: WhatsAppTemplateParameterType.TEXT
  text: string
}

export interface WhatsappTemplateHeaderImageParameter {
  type: WhatsAppTemplateParameterType.IMAGE
  image: {
    link: string
  }
}

export interface WhatsappTemplateComponentHeader {
  type: WhatsAppTemplateComponentType.HEADER
  parameters:
    | WhatsappTemplateHeaderTextParameter[]
    | WhatsappTemplateHeaderImageParameter[]
  // | {
  //     type: WhatsAppTemplateParameterType.VIDEO
  //     video: string
  //   }[]
  // | {
  //     type: WhatsAppTemplateParameterType.DOCUMENT
  //     document: string
  //   }[]
}

export interface WhatsappTemplateComponentBody {
  type: WhatsAppTemplateComponentType.BODY
  parameters: {
    type: WhatsAppTemplateParameterType.TEXT
    parameter_name: string
    text: string
  }[]
}

export interface WhatsappTemplateComponentFooter {
  type: WhatsAppTemplateComponentType.FOOTER
  parameters: {
    type: WhatsAppTemplateParameterType.TEXT
    parameter_name: string
    text: string
  }[]
}

export interface WhatsappTemplateComponentButtons {
  type: WhatsAppTemplateComponentType.BUTTONS
  buttons: WhatsappTemplateButton[]
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
