import { Channels } from '@botonic/core'
import merge from 'lodash.merge'
import UAParser from 'ua-parser-js'
import { v4 as uuidv4 } from 'uuid'

import { isDev } from '../../util/environment'
import { WEBCHAT } from '../constants'
import { getProperty } from './objects'

/**
 * Returns the value of a property defined in bot's theme based on WEBCHAT.CUSTOM_PROPERTIES dictionary.
 * It gives preference to nested defined properties (e.g.: header.style) over plain properties (e.g.: headerStyle).
 * If property doesn't exist, returns the defaultValue.
 */
export const _getThemeProperty = theme => (
  property,
  defaultValue = undefined
) => {
  for (const [k, v] of Object.entries(WEBCHAT.CUSTOM_PROPERTIES)) {
    if (v == property) {
      const nestedProperty = getProperty(theme, v)
      if (nestedProperty !== undefined) return nestedProperty
      const plainProperty = getProperty(theme, k)
      if (plainProperty !== undefined) return plainProperty
      return defaultValue
    }
  }
  return undefined
}

export const createUser = () => {
  const parser = new UAParser()
  const ua = parser.getResult()
  let name = `${ua.os.name} ${ua.browser.name}`
  if (ua.device && ua.device.type) name = `${ua.device.type} ${name}`

  return {
    id: uuidv4(),
    name,
    channel: isDev ? Channels.DEV : Channels.WEBCHAT,
  }
}

export const initUser = user => {
  if (!user) return createUser()
  if (user && !user.id) return merge(user, createUser())
  return user
}

export const shouldKeepSessionOnReload = ({
  initialDevSettings,
  devSettings,
}) => !initialDevSettings || (devSettings && devSettings.keepSessionOnReload)

export const getServerErrorMessage = serverConfig => {
  if (!serverConfig || !serverConfig.errorMessage) return 'Connection issues'
  if (typeof serverConfig.errorMessage === 'function') {
    return serverConfig.errorMessage()
  }
  return serverConfig.errorMessage
}
