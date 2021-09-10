// eslint-disable-next-line filenames/match-regex
import { botExecutorHandlerFactory } from '@botonic/api/src/handlers/bot-executor'
import { app as bot } from 'bot'

import { handlers } from '.'

// create dataProvider
async function botExecutor({ input, session, lastRoutePath, websocketId }) {
  const { parsedResponse } = await bot.input({
    // dataProvider
    input,
    session,
    lastRoutePath,
  })
  await handlers.run('sender', { messages: parsedResponse, websocketId })
}

// eslint-disable-next-line no-undef
export default botExecutorHandlerFactory(ENV, botExecutor)
