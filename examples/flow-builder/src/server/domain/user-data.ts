import { COUNTRIES, LANGUAGES } from '../../shared/constants'
import { BotSession, ContextWithLocale } from '../types'
import { empty } from '../utils/functional'

/**
 * Fields will never be ''. They can only have a valid value or be undefined
 * All functions must be static because when stored in bot session, the type info may get lost
 */

type UserDataOptions = {
  country: string
  language: string
}

export class UserData {
  public country: string
  public language: string

  constructor(options: UserDataOptions) {
    this.country = options.country
    this.language = options.language
  }

  static createWithDefaults(): UserData {
    return new UserData({
      country: COUNTRIES.spain,
      language: LANGUAGES.spanish,
    })
  }

  static get(session: BotSession): UserData {
    let userData = (session.user.extra_data as UserData) || {}
    if (empty(userData)) {
      userData = UserData.createWithDefaults()
      session.user.extra_data = userData
    }
    return session.user.extra_data
  }
}

export function context(session: BotSession): ContextWithLocale {
  const userData = UserData.get(session)
  return {
    locale: `${userData.language}-${userData.country}`,
  }
}
