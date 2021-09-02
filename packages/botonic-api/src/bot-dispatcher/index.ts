import { AWSBotDispatcher } from './aws-bot-dispatcher'
import { LocalBotDispatcher } from './local-bot-dispatcher'

export interface ExecutionParams {
  input: any
  session: any
  lastRoutePath: string
}

export type DispatchArgs = ExecutionParams & { websocketId: string }

export interface BotDispatcher {
  dispatch: (args: DispatchArgs) => Promise<void>
}

export class BotExecutor {
  bot: any
  constructor(bot: any) {
    this.bot = bot
  }
  async run({ input, session, lastRoutePath }: ExecutionParams): Promise<void> {
    return await this.bot.app.input({
      input,
      session,
      lastRoutePath,
    })
  }
}

export function botDispatcherFactory(env, bot): BotDispatcher {
  if (env === 'local') {
    const botExecutor = new BotExecutor(bot)
    return new LocalBotDispatcher(botExecutor)
  }
  if (env === 'aws') {
    return new AWSBotDispatcher()
  }
  throw Error(`BotDispatcher not implemented for '${env}' environment.`)
}
