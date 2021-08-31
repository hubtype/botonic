import { AWSBotDispatcher } from './aws-bot-dispatcher'
import { LocalBotDispatcher } from './local-bot-dispatcher'

export interface ExecutionParams {
  input: any
  session: any
  lastRoutePath: string
}

export type DispatchArgs = ExecutionParams & { websocketId: string }

export interface BotDispatcher {
  bot: any
  dispatch: (args: DispatchArgs) => Promise<void>
}

export function botDispatcherFactory(env, bot): BotDispatcher {
  if (env === 'local') return new LocalBotDispatcher(bot)
  if (env === 'aws') return new AWSBotDispatcher(bot)
  throw Error(`BotDispatcher not implemented for '${env}' environment.`)
}
