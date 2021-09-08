import { botExecutorHandlerFactory } from '@botonic/api/src/handlers/bot-executor'

import { app as bot } from 'bot'
import { handlers } from '.'

async function botExecutor({ input, session, lastRoutePath, websocketId }) {
  const { parsedResponse } = await bot.input({
    input,
    session,
    lastRoutePath,
  })
  await handlers.run('sender', { messages: parsedResponse, websocketId })
}

export default botExecutorHandlerFactory(ENV, botExecutor)
