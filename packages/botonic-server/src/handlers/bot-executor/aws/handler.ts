import { awsBotExecutor } from './aws-bot-executor'

export function awsHandler(bot, dataProvider, dispatchers) {
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
