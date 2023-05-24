import { BaseEvent } from '../base-event'

export enum MessageEventTypes {
  AUDIO = 'audio',
  CAROUSEL = 'carousel',
  CONTACT = 'contact',
  CUSTOM = 'custom',
  DOCUMENT = 'document',
  IMAGE = 'image',
  LOCATION = 'location',
  TEXT = 'text',
  POSTBACK = 'postback',
  VIDEO = 'video',
  MISSED = 'missed',
  FORM = 'form',
  CHAT_EVENT = 'chatevent',
  /**
   * TODO: buttonmessage?, webchatsettings, whatsapp template
   */
}

export enum MessageEventAck {
  DRAFT = 'draft',
  READ = 'read',
  RECEIVED = 'received',
  SENT = 'sent',
}

export enum MessageEventFrom {
  AGENT = 'agent',
  BOT = 'bot',
  USER = 'user',
}

export interface BotonicMessageEvent extends BaseEvent {
  ack: MessageEventAck
  from: MessageEventFrom
  type: MessageEventTypes
  typing: number
  delay: number
}
