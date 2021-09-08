import { dataProviderFactory } from '@botonic/api/src/data-provider'
import { EventTypes } from '@botonic/core/lib/esm/models/events'
import { ConnectionEventStatuses } from '@botonic/core/lib/esm/models/events/connections'
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
