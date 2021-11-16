import { ConnectionEventStatuses } from '@botonic/core'

import { createConnectionEvent } from '../../helpers'

export const doDisconnect = async (websocketId, dataProvider) => {
  try {
    const user = await dataProvider.getUserByWebsocketId(websocketId)
    if (!user) throw new Error('User not found')
    await dataProvider.updateUser({ ...user, isOnline: false, websocketId: '' })
    await dataProvider.saveEvent(
      createConnectionEvent({
        user,
        status: ConnectionEventStatuses.DISCONNECTED,
      })
    )
  } catch (e) {
    console.log({ e })
  }
  console.log('Disconnected')
}
