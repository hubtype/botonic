export { Webchat } from './webchat'
export { WebchatDev } from './webchat-dev'

/**
 * @returns {WebChatApp}
 */
export function getBotonicApp() {
  // Botonic is exported from your bot
  // eslint-disable-next-line no-undef
  return Botonic
}
