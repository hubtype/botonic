import { CoreBot } from '../../src/core-bot'
import { Session } from '../../src/models/legacy-types'

export const LOCALE_EN = 'en'
export const COUNTRY_GB = 'GB'
export const SYSTEM_LOCALE_EN_GB = 'en-GB'
export const developerRoutes = [{ path: '', text: 'hello', action: 'Hi user!' }]
export const developerLocales = {
  [LOCALE_EN]: {
    text1: ['Hello!', 'Hey there!', 'Aloha'],
    text2: ["What's up?", "How're you?"],
    text3: ['Bye!', 'See you later', 'Ciao'],
  },
}

export function initCoreBotWithDeveloperConfig(extraConfig = {}) {
  return new CoreBot({
    renderer: async args => args.actions.filter(action => action),
    routes: developerRoutes,
    locales: developerLocales,
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
