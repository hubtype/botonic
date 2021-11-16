import { dataProviderFactory, senderHandlerFactory } from '@botonic/server'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

// eslint-disable-next-line no-undef
export default senderHandlerFactory(ENV, dataProvider)
