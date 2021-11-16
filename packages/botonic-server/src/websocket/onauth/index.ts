import { ConnectionEventStatuses } from '@botonic/core'
import { decode } from 'jsonwebtoken'

import { createConnectionEvent, initChannelInformation } from '../../helpers'

const initialBotState = {
  botId: '1234',
  lastRoutePath: null,
  isFirstInteraction: true,
  retries: 0,
  isHandoff: false,
  isShadowing: false,
}

export const doAuth = async ({
  websocketId,
  data,
  send,
  dataProvider,
  eventHandlers = {},
}) => {
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
    if ('onNewUser' in eventHandlers) {
      // @ts-ignore
      await eventHandlers.onNewUser({ user, details: user })
    }
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
