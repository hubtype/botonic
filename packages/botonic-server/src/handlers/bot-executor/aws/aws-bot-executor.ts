import {
  publishBotAction,
  publishBotExecuted,
  publishReceivedMessage,
} from '../../../notifying'
import { botExecutor } from '../bot-executor'

// Factory to get eventHandlers
// eventHandlers | eventPublishers | eventNotifiers

const eventHandlers = {
  onReceivedMessage: publishReceivedMessage,
  onBotExecuted: publishBotExecuted,
  onBotAction: publishBotAction,
}

export function awsBotExecutor(bot, dataProvider, dispatchers) {
  return botExecutor(bot, dataProvider, dispatchers, eventHandlers)
}
