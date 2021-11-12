import { botExecutor } from './bot-executor'

export function localBotExecutor(bot, dataProvider, dispatchers) {
  return botExecutor(bot, dataProvider, dispatchers)
}
