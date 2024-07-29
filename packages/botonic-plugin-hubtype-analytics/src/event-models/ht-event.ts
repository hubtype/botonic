/* eslint-disable @typescript-eslint/naming-convention */
import { EventAction, EventType, HtEventProps, RequestData } from '../types'

export class HtEvent {
  chat_id?: string
  type: EventType
  chat_language: string
  chat_country?: string
  format_version?: number
  bot_version?: string
  flow_version?: string
  action: EventAction
  bot_interaction_id?: string

  constructor(event: HtEventProps, requestData: RequestData) {
    this.chat_id = requestData.userId
    this.chat_language = requestData.language
    this.chat_country = requestData.country
    this.format_version = 2
    this.action = event.action
    this.bot_interaction_id = requestData.botInteractionId
  }
}
