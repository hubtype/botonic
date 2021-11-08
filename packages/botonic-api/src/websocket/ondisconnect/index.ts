import { ConnectionEventStatuses, EventTypes } from '@botonic/core'
import { ulid } from 'ulid'

export const doDisconnect = async (websocketId, dataProvider) => {
  try {
    const user = await dataProvider.getUserByWebsocketId(websocketId)
    if (!user) throw new Error('User not found')
    await dataProvider.updateUser({ ...user, isOnline: false, websocketId: '' })
    await dataProvider.saveEvent({
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
