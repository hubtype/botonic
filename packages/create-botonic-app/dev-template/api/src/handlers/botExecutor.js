// eslint-disable-next-line filenames/match-regex
import { dispatchersFactory } from '@botonic/api/src/dispatchers'
import { botExecutorHandlerFactory } from '@botonic/api/src/handlers/bot-executor'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'
import { app as bot } from 'bot'

import sender from './sender'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

const dispatchers = dispatchersFactory(ENV, { sender })

// eslint-disable-next-line no-undef
export default botExecutorHandlerFactory(ENV, bot, dataProvider, dispatchers)
