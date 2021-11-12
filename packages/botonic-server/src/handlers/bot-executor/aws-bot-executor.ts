import {
  publishBotAction,
  publishBotExecuted,
  publishReceivedMessage,
} from '../../notifying'
import { botExecutor } from './bot-executor'

const eventHandlers = {
  onReceivedMessage: publishReceivedMessage,
  onBotExecuted: publishBotExecuted,
  onBotAction: publishBotAction,
}

export function awsBotExecutor(bot, dataProvider, dispatchers) {
  return botExecutor(bot, dataProvider, dispatchers, eventHandlers)
}
