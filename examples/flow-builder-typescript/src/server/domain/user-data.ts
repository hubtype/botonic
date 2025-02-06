import { BotSession, ContextWithLocale } from '../types'

export const empty = (object: Record<string, any>): boolean =>
  Object.keys(object).length === 0

const COUNTRIES = {
  spain: 'ES',
  united_states: 'US',
  united_kingdom: 'UK',
} as const

const LANGUAGES = {
  spanish: 'es',
  english: 'en',
} as const

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
      country: COUNTRIES.united_states,
      language: LANGUAGES.english,
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
