export enum WhatsAppTemplateButtonSubType {
  URL = 'URL',
  QUICK_REPLY = 'QUICK_REPLY',
  PHONE_NUMBER = 'PHONE_NUMBER',
  VOICE_CALL = 'VOICE_CALL',
  FLOW = 'FLOW',
}

export enum WhatsAppTemplateParameterType {
  PAYLOAD = 'PAYLOAD',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  ACTION = 'ACTION',
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

export interface WhatsappTemplateHeaderVideoParameter {
  type: WhatsAppTemplateParameterType.VIDEO
  video: {
    link: string
  }
}

export interface WhatsappTemplateComponentHeader {
  type: WhatsAppTemplateComponentType.HEADER
  parameters:
    | WhatsappTemplateHeaderTextParameter[]
    | WhatsappTemplateHeaderImageParameter[]
    | WhatsappTemplateHeaderVideoParameter[]
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

export interface WhatsappTemplateVoiceCallButton {
  type: WhatsAppTemplateComponentType.BUTTON
  sub_type: WhatsAppTemplateButtonSubType.VOICE_CALL
  index: number
  parameters: []
}

export interface WhatsappTemplatePhoneNumberButton {
  type: WhatsAppTemplateComponentType.BUTTON
  sub_type: WhatsAppTemplateButtonSubType.PHONE_NUMBER
  index: number
  parameters: []
}

export interface WhatsappTemplateFlowAction {
  flow_token: string
  flow_action_data?: Record<string, string>
}

export interface WhatsappTemplateFlowActionParameter {
  type: WhatsAppTemplateParameterType.ACTION
  action: WhatsappTemplateFlowAction
}

export interface WhatsappTemplateFlowButton {
  type: WhatsAppTemplateComponentType.BUTTON
  sub_type: WhatsAppTemplateButtonSubType.FLOW
  index: string
  parameters: WhatsappTemplateFlowActionParameter[]
}

export type WhatsappTemplateButton =
  | WhatsappTemplateQuickReplyButton
  | WhatsappTemplateUrlButton
  | WhatsappTemplateVoiceCallButton
  | WhatsappTemplatePhoneNumberButton
  | WhatsappTemplateFlowButton
