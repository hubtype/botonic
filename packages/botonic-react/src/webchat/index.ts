// @ts-nocheck
export { WebchatContext } from './context'
export { Webchat } from './webchat'
export { WebchatDev } from './webchat-dev'

export function getBotonicApp() {
  // Botonic is exported from your bot
  // eslint-disable-next-line no-undef
  return Botonic
}

export * from './index-types'
