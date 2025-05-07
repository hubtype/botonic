import { BotSession } from '../types'

export const empty = (object: Record<string, any>): boolean =>
  Object.keys(object).length === 0

/**
 * Fields will never be ''. They can only have a valid value or be undefined
 * All functions must be static because when stored in bot session, the type info may get lost
 */

export class UserData {
  constructor() {}

  static createWithDefaults(): UserData {
    return new UserData()
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
