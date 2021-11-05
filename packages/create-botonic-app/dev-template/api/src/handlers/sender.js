import { senderHandlerFactory } from '@botonic/api/src/handlers/sender'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

// eslint-disable-next-line no-undef
export default senderHandlerFactory(ENV, dataProvider)
