import { BotContext, Session, SessionUser } from '@botonic/core'

import { UserData } from './domain/user-data'
import { BotPlugins } from './plugins'

export type BotRequest = BotContext<BotPlugins, UserData>

// Only use this type for webviews
export interface BotSession extends Session {
  user: SessionUser & {
    extra_data: UserData
  }
}
