import { CoreBot } from '../../src/core-bot'
import type { Session } from '../../src/models/legacy-types'

export const LOCALE_EN = 'en'
export const COUNTRY_GB = 'GB'
export const SYSTEM_LOCALE_EN_GB = 'en-GB'
export const developerRoutes = [{ path: '', text: 'hello', action: 'Hi user!' }]

export function initCoreBotWithDeveloperConfig(extraConfig = {}) {
  return new CoreBot({
    renderer: async args => args.actions,
    routes: developerRoutes,
    ...extraConfig,
  })
}

export function createSessionWithUser(session?: Partial<Session>) {
  return {
    ...session,
    user: {
      locale: LOCALE_EN,
      country: COUNTRY_GB,
      system_locale: LOCALE_EN,
      ...session?.user,
    },
  }
}
