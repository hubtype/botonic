import { BaseEventData, EventName, HtEventProps, RequestData } from '../types'

export class HtEvent {
  chat: string
  event_type: EventName
  event_data: BaseEventData

  constructor(event: HtEventProps, requestData: RequestData) {
    this.chat = requestData.userId
    this.event_type = event.event_type
    this.event_data = {
      channel: requestData.provider,
      event_datetime: new Date().toISOString(),
      enduser_language: requestData.language,
      enduser_country: requestData.country,
      format_version: 1,
      // flow_version?: string
    }
  }
}
