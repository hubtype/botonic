// eslint-disable-next-line filenames/match-regex
import { botExecutorHandlerFactory } from '@botonic/api/src/handlers/bot-executor'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'
import { app as bot } from 'bot'

import { handlers } from '.'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

async function botExecutor({ input, session, lastRoutePath, websocketId }) {
  const { messageEvents } = await bot.input({
    dataProvider,
    input,
    session,
    lastRoutePath,
  })
  await handlers.run('sender', { events: messageEvents, websocketId })
}

// eslint-disable-next-line no-undef
export default botExecutorHandlerFactory(ENV, botExecutor)
