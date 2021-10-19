// eslint-disable-next-line filenames/match-regex
import { botExecutorHandlerFactory } from '@botonic/api/src/handlers/bot-executor'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'
import { app as bot } from 'bot'

import { handlers } from '.'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

async function botExecutor({ input, session, botState, websocketId }) {
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
  await handlers.run('sender', {
    events,
    websocketId,
  })
}

// eslint-disable-next-line no-undef
export default botExecutorHandlerFactory(ENV, botExecutor)
