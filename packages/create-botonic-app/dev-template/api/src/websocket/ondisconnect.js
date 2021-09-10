import { ConnectionEventStatuses, EventTypes } from '@botonic/core'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'
import { ulid } from 'ulid'

export const onDisconnect = async websocketId => {
  const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
  try {
    const user = await dp.getUserByWebsocketId(websocketId)
    await dp.updateUser({ ...user, isOnline: false, websocketId: '' })
    await dp.saveEvent({
      eventType: EventTypes.CONNECTION,
      userId: user.id,
      eventId: ulid(),
      createdAt: new Date().toISOString(),
      status: ConnectionEventStatuses.DISCONNECTED,
    })
  } catch (e) {
    console.log({ e })
  }
  console.log('Disconnected')
}
