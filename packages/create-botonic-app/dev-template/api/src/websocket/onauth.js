import { ConnectionEventStatuses, EventTypes } from '@botonic/core'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'
import { decode } from 'jsonwebtoken'
import { ulid } from 'ulid'

export const onAuth = async ({ websocketId, data, send }) => {
  const { token } = JSON.parse(data)
  const { userId } = decode(token)
  const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
  let user = await dp.getUser(userId)
  console.log('got user', { user })
  await dp.saveEvent({
    eventType: EventTypes.CONNECTION,
    userId,
    eventId: ulid(),
    createdAt: new Date().toISOString(),
    status: ConnectionEventStatuses.CONNECTED,
  })
  if (!user) {
    console.log('create user connection id', websocketId)
    user = await dp.saveUser({
      id: userId,
      websocketId,
      isOnline: true,
      route: '/',
      session: JSON.stringify({}),
    })
    console.log('created user', { user })
  } else {
    // UPDATE USER CONNECTION
    user = await dp.updateUser({
      ...user,
      websocketId,
    })
    console.log('updated user', { user })
  }
}
