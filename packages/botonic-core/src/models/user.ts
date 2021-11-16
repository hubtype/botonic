import { BotState } from './bot-state'
import { Session } from './session'

export interface User {
  id: string //TODO: UUID
  name?: string
  userName?: string
  channel: string
  idFromChannel: string // providerId
  session: Session
  botState: BotState
  isOnline: boolean
  websocketId?: string
  // part of details?
  locationInfo: string
}
