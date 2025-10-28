/* eslint-disable @typescript-eslint/naming-convention */
import { EVENT_FORMAT_VERSION } from '@botonic/core'

import { EventAction, EventType, HtEventProps, RequestData } from '../types'
export class HtEvent {
  chat_id?: string
  type: EventType
  format_version?: number
  bot_version?: string
  flow_version?: string
  action: EventAction
  bot_interaction_id?: string
  user_locale: string
  user_country: string
  system_locale: string

  constructor(event: HtEventProps, requestData: RequestData) {
    this.chat_id = requestData.userId
    this.format_version = EVENT_FORMAT_VERSION
    this.action = event.action
    this.bot_interaction_id = requestData.botInteractionId
    this.user_locale = requestData.userLocale
    this.user_country = requestData.userCountry
    this.system_locale = requestData.systemLocale
  }
}
