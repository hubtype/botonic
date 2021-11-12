import { devBotExecutor } from './dev-bot-executor'

export function devHandler(bot, dataProvider, dispatchers) {
  return devBotExecutor(bot, dataProvider, dispatchers)
}
