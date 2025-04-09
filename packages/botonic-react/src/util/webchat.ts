import merge from 'lodash.merge'
import UAParser from 'ua-parser-js'
import { v7 as uuidv7 } from 'uuid'

import { WEBCHAT } from '../constants'
import { timeZoneToCountryCode } from '../time-zone-to-country-code'
import { ClientUser } from '../webchat/context/types'
import { ThemeProps } from '../webchat/theme/types'
import { getProperty } from './objects'

/**
 * Returns the value of a property defined in bot's theme based on WEBCHAT.CUSTOM_PROPERTIES dictionary.
 * It gives preference to nested defined properties (e.g.: header.style) over plain properties (e.g.: headerStyle).
 * If property doesn't exist, returns the defaultValue.
 */
export const _getThemeProperty =
  (theme: ThemeProps) => (property: string, defaultValue?: any) => {
    for (const [key, value] of Object.entries(WEBCHAT.CUSTOM_PROPERTIES)) {
      if (value === property) {
        const nestedProperty = getProperty(theme, value)
        if (nestedProperty !== undefined) return nestedProperty
        const plainProperty = getProperty(theme, key)
        if (plainProperty !== undefined) return plainProperty
        return defaultValue
      }
    }
    return undefined
  }

export const createUser = (): {
  id: string
  name: string
} => {
  const parser = new UAParser()
  const ua = parser.getResult()
  let name = `${ua.os.name} ${ua.browser.name}`
  if (ua.device && ua.device.type) name = `${ua.device.type} ${name}`
  return {
    id: uuidv7(),
    name,
  }
}
export const initSession = (
  session: any
): { user: { id: string; name: string } } => {
  if (!session) session = {}
  const hasUserId = session?.user?.id !== undefined
  if (!session.user || Object.keys(session.user).length === 0 || !hasUserId)
    session.user = !hasUserId ? merge(session.user, createUser()) : createUser()
  return session
}

export function predictUserLocaleAndCountry(user: Partial<ClientUser>) {
  if (!user.locale) {
    user.locale = user.extra_data?.language
      ? (user.extra_data.language as string)
      : navigator.language
  }

  if (!user.country) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const userCountry = timeZoneToCountryCode[timeZone]
    user.country = user.extra_data?.country
      ? (user.extra_data.country as string)
      : userCountry
  }

  return user
}

export const shouldKeepSessionOnReload = ({
  initialDevSettings,
  devSettings,
}) => !initialDevSettings || (devSettings && devSettings.keepSessionOnReload)

//TODO: Review param serverConfig if is of type ServerConfig this never have errorMessage
export const getServerErrorMessage = serverConfig => {
  if (!serverConfig || !serverConfig.errorMessage) return 'Connection issues'
  if (typeof serverConfig.errorMessage === 'function') {
    return serverConfig.errorMessage()
  }
  return serverConfig.errorMessage
}
