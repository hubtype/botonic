// eslint-disable-next-line filenames/match-regex
import {
  botExecutorHandlerFactory,
  dataProviderFactory,
  dispatchersFactory,
} from '@botonic/server'
import { app as bot } from 'bot'

import sender from './sender'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

const dispatchers = dispatchersFactory(ENV, { sender })

// eslint-disable-next-line no-undef
export default botExecutorHandlerFactory(ENV, bot, dataProvider, dispatchers)
