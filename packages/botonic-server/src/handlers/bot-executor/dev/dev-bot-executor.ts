import { botExecutor } from '../bot-executor'

const eventHandlers = {
  onReceivedMessage: () => {},
  onBotExecuted: () => {},
  onBotAction: () => {},
}

export function devBotExecutor(bot, dataProvider, dispatchers) {
  return botExecutor(bot, dataProvider, dispatchers, eventHandlers)
}
