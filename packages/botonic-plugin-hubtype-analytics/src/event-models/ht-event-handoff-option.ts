import {
  EventAction,
  EventHandoffOption,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventHandoffOption extends HtEvent {
  action: EventAction.HandoffOption
  handoff_queue_id: string
  handoff_queue_name: string

  constructor(event: EventHandoffOption, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.handoff_queue_id = event.queueId
    this.handoff_queue_name = event.queueName
  }
}