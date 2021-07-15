import { dataProviderFactory } from '@botonic/api/src/data-provider'

export const onConnect = async websocketId => {
  const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
  await dp.addConnection(websocketId)
  console.log('Connected Successfully')
}
