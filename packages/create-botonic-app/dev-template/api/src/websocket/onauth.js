import { ConnectionEventStatuses, EventTypes } from '@botonic/core'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'
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

export const onAuth = async ({ websocketId, data, send }) => {
  const { token } = JSON.parse(data)
  const { userId } = decode(token)
  const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
  let user = await dp.getUser(userId)
  await dp.saveEvent({
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
    user = await dp.saveUser(newUser)
  } else {
    // UPDATE USER CONNECTION
    user = await dp.updateUser({
      ...user,
      websocketId,
    })
  }
}
