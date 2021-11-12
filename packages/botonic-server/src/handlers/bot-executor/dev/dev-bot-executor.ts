import { botExecutor } from '../bot-executor'

export function devBotExecutor(bot, dataProvider, dispatchers) {
  return botExecutor(bot, dataProvider, dispatchers)
}
