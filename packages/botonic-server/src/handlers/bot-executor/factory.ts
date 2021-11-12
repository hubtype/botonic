import { Environments } from '../../constants'
import { awsBotExecutor } from './aws-bot-executor'
import { localBotExecutor } from './local-bot-executor'

export function botExecutorHandlerFactory(env, bot, dataProvider, dispatchers) {
  if (env === Environments.LOCAL) {
    return localBotExecutor(bot, dataProvider, dispatchers)
  }
  if (env === Environments.AWS) {
    return async function (event, context) {
      try {
        const params = JSON.parse(event.Records[0].body)
        await awsBotExecutor(bot, dataProvider, dispatchers)(params)
      } catch (e) {
        console.error(e)
        return {
          statusCode: 500,
        }
      }
      return {
        statusCode: 200,
      }
    }
  }
}
