import { BaseEvent, EventTypes } from '..'

export enum MessageEventType {
  text = 'text',
  audio = 'audio',
  document = 'document',
  image = 'image',
  video = 'video',
  location = 'location',
  carousel = 'carousel',
  custom = 'custom',
}

export enum MessageEventAck {
  draft = 'draft',
  sent = 'sent',
  received = 'received',
  read = 'read',
}

export enum MessageEventFrom {
  user = 'user',
  bot = 'bot',
  agent = 'agent',
}

export interface BotonicMessageEvent<MessageType>
  extends BaseEvent<EventTypes.message> {
  type: MessageType
  ack: keyof typeof MessageEventAck
  from: keyof typeof MessageEventFrom
}
