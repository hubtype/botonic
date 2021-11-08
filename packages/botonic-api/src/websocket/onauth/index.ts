import { ConnectionEventStatuses, EventTypes } from '@botonic/core'
import { decode } from 'jsonwebtoken'
import { ulid } from 'ulid'

const initialBotState = {
  botId: '1234',
  lastRoutePath: null,
  isFirstInteraction: true,
  retries: 0,
  isHandoff: false,
  isShadowing: false,
}

export const doAuth = async ({ websocketId, data, send, dataProvider }) => {
  const { token } = JSON.parse(data)
  // @ts-ignore
  const { userId } = decode(token)
  let user = await dataProvider.getUser(userId)
  await dataProvider.saveEvent({
    eventType: EventTypes.CONNECTION,
    userId,
    eventId: ulid(),
    createdAt: new Date().toISOString(),
    status: ConnectionEventStatuses.CONNECTED,
  })
  if (!user) {
    const newUser = {
      id: userId,
      websocketId,
      isOnline: true,
      botState: initialBotState,
      session: {},
      details: {}, // TODO: To be filled with geolocation info
    }
    user = await dataProvider.saveUser(newUser)
  } else {
    // UPDATE USER CONNECTION
    user = await dataProvider.updateUser({
      ...user,
      websocketId,
    })
  }
}
