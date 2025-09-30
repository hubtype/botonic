import { Input } from './legacy-types'

export interface ConnectionChangeEvent {
  action: 'connectionChange'
  online: boolean
}

export interface UpdateMessageInfoPayload {
  id: string
  ack: number
  unsentInput?: Input
}

export interface UpdateMessageInfoEvent {
  action: 'update_message_info'
  message: UpdateMessageInfoPayload
}

export interface GenericHubtypeEvent {
  action?: string
  [key: string]: unknown
}

export type HubtypeEvent =
  | ConnectionChangeEvent
  | UpdateMessageInfoEvent
  | GenericHubtypeEvent

export type HubtypeEventHandler = (event: HubtypeEvent) => void
