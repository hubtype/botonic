import { CoreBot } from '../../src/core-bot'

export const LOCALE_EN = 'en'
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
    renderer: async args => [args],
    routes: developerRoutes,
    locales: developerLocales,
    ...extraConfig,
  })
}
