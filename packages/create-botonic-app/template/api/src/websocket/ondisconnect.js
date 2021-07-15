import { dataProviderFactory } from '@botonic/api/src/data-provider'

export const onDisconnect = async websocketId => {
  var dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
  await dp.deleteConnection(websocketId)
  try {
    const user = await dp.getUserByWebsocketId(websocketId)
    await dp.updateUser({ ...user, isOnline: false, websocketId: '' })
  } catch (e) {}
  console.log('Disconnected')
}
