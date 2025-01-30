import { Session, SessionUser } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { UserData } from './domain/user-data'
import { BotPlugins } from './plugins/index'

export interface BotRequest extends ActionRequest {
  plugins: BotPlugins
  session: BotSession
}

export interface BotSession extends Session {
  _access_token: string
  user: SessionUser & {
    extra_data: UserData
  }
}

export interface ContextWithLocale {
  locale: string
}
