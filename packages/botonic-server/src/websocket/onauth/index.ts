import { ConnectionEventStatuses, EventTypes } from '@botonic/core'
import { decode } from 'jsonwebtoken'

import {
  createConnectionEvent,
  createIntegrationEvent,
  initChannelInformation,
} from '../../helpers'
import { sqsPublisher } from '../../notifying'

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
  const { userId, idFromChannel, channel } = decode(token)
  let user = await dataProvider.getUser(userId)
  if (!user) {
    const newUser = {
      id: userId,
      websocketId,
      isOnline: true,
      botState: initialBotState,
      session: {},
      details: {}, // TODO: To be filled with geolocation info
      ...initChannelInformation({ idFromChannel, channel }),
    }
    user = await dataProvider.saveUser(newUser)
    await sqsPublisher?.publish(
      createIntegrationEvent(EventTypes.NEW_USER, { user, details: user })
    )
  } else {
    // UPDATE USER CONNECTION
    user = await dataProvider.updateUser({
      ...user,
      websocketId,
    })
  }
  await dataProvider.saveEvent(
    createConnectionEvent({ user, status: ConnectionEventStatuses.CONNECTED })
  )
}
