import { dataProviderFactory } from '@botonic/server/src/data-provider'
import { senderHandlerFactory } from '@botonic/server/src/handlers/sender'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

// eslint-disable-next-line no-undef
export default senderHandlerFactory(ENV, dataProvider)
