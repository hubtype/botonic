export { Router } from './router'
export { getString } from './i18n'
export {
  getOpenQueues,
  humanHandOff,
  HandOffBuilder,
  storeCaseRating,
  getAvailableAgents,
  getAvailableAgentsByQueue,
  getAgentVacationRanges,
  cancelHandoff,
  deleteUser,
} from './handoff'
export { getNLU } from './nlu'
export { isBrowser, isNode, isMobile, params2queryString } from './utils'
export { CoreBot } from './core-bot'
export { HubtypeService } from './hubtype-service'
export { Providers } from './constants'
export * from './debug'

export const PROVIDER = Object.freeze({
  DEV: 'dev',
  FACEBOOK: 'facebook',
  GENERIC: 'generic',
  INTERCOM: 'intercom',
  SMOOCH: 'smooch',
  TELEGRAM: 'telegram',
  TWITTER: 'twitter',
  WEBCHAT: 'webchat',
  WECHAT: 'wechat',
  WHATSAPP: 'whatsapp',
})

export const INPUT = Object.freeze({
  TEXT: 'text',
  POSTBACK: 'postback',
  AUDIO: 'audio',
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  LOCATION: 'location',
  CONTACT: 'contact',
  BUTTON_MESSAGE: 'buttonmessage',
  CAROUSEL: 'carousel',
  CUSTOM: 'custom',
  WEBCHAT_SETTINGS: 'webchatsettings',
})
