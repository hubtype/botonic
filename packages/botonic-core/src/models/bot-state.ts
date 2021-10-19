import { RoutePath } from './legacy-types'

export interface BotState {
  botId: string
  isFirstInteraction: boolean
  isHandoff: boolean
  isShadowing: boolean
  lastRoutePath: RoutePath
  locale?: string
  retries: number
  botonicAction?: any
}
