import { Channels } from '@botonic/core'

import { sendEvents } from '../send-events'
import { devSender } from './dev-sender'

export function devHandler(dataProvider) {
  return async function ({ userId, events }) {
    const user = await dataProvider.getUser(userId)
    if (user.channel === Channels.DEV) {
      const sender = devSender
      await sendEvents({ user, events, sender })
    }
  }
}
