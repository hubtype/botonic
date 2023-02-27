import { Session, SessionUser } from '@botonic/core'

export interface BotSession extends Session {
  _botonic_action: string
  _access_token: string
  _hubtype_case_id?: string
  user: SessionUser
  lastMessageSentDate: string
}

export type GA4Options = {
  getClientId?: () => string
}

export type GA4Event = {
  name: string
  params?: GA4Params
}

export type GA4Params = Record<string, string | number>

export type EventBodyParams = {
  clientId: string
  events: GA4Event[]
}
