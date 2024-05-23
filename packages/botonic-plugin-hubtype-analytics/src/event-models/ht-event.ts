import { EventType, HtEventProps, RequestData } from '../types'

// Eliminar despres de refactoritzar tots els events
interface BaseHtEventData {
  channel: string
  created_at: string
  chat_language: string
  chat_country?: string
  format_version?: number
  bot_version?: string
  flow_version?: string
}

export class HtEvent {
  chat_id: string
  type: EventType
  channel: string
  created_at: string
  chat_language: string
  chat_country?: string
  format_version?: number
  bot_version?: string
  flow_version?: string
  data: any

  constructor(event: HtEventProps, requestData: RequestData) {
    this.chat_id = requestData.userId
    this.channel = requestData.provider
    this.created_at = new Date().toISOString()
    this.chat_language = requestData.language
    this.chat_country = requestData.country
    this.format_version = 2
    this.data = {}
    this.data.action = event.action
  }
}
