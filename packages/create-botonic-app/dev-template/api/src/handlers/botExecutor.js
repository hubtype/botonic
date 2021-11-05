// eslint-disable-next-line filenames/match-regex
import { botExecutorHandlerFactory } from '@botonic/api/src/handlers/bot-executor'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'
import { dispatchersFactory } from '@botonic/api/src/dispatchers'

import { app as bot } from 'bot'

import sender from './sender'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

const dispatchers = dispatchersFactory(ENV, { sender })

async function botExecutor({ userId, input, session, botState, websocketId }) {
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
  await dispatchers.run('sender', {
    userId,
    events,
    websocketId,
  })
}

// eslint-disable-next-line no-undef
export default botExecutorHandlerFactory(ENV, botExecutor)
