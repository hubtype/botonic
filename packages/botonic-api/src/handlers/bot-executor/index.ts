import { Environments } from '../..'

const botExecutor = (bot, dataProvider, dispatchers) =>
  async function executeBot({ userId, input, session, botState, websocketId }) {
    const output = await bot.input({
      input,
      session,
      botState,
      dataProvider,
    })
    const events = [
      ...output.messageEvents,
      { action: 'update_bot_state', ...output.botState },
      { action: 'update_session', ...output.session },
    ]
    // post events to sender sqs
    await dispatchers.dispatch('sender', {
      userId,
      events,
      websocketId,
    })
  }

export function botExecutorHandlerFactory(env, bot, dataProvider, dispatchers) {
  if (env === Environments.LOCAL)
    return botExecutor(bot, dataProvider, dispatchers)
  if (env === Environments.AWS) {
    return async function (event, context) {
      try {
        const params = JSON.parse(event.Records[0].body)
        // Publish Received Message Event
        // await dataProvider.saveEvent()
        await botExecutor(bot, dataProvider, dispatchers)(params)
        // Publish Bot Executed Event
      } catch (e) {
        // Bot Failed Event
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
