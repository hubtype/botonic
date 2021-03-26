export { Providers } from './constants'
export { CoreBot } from './core-bot'
export * from './debug'
export {
  cancelHandoff,
  deleteUser,
  getAgentVacationRanges,
  getAvailableAgents,
  getAvailableAgentsByQueue,
  getOpenQueues,
  HandOffBuilder,
  humanHandOff,
  storeCaseRating,
} from './handoff'
export { HubtypeService } from './hubtype-service'
export { getString } from './i18n'
export { Router } from './router'
export { Router2 } from './router-another'
export { isBrowser, isMobile, isNode, params2queryString } from './utils'

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
  WHATSAPP_TEMPLATE: 'whatsapptemplate',
})

export const CASE_STATUS = Object.freeze({
  WAITING: 'status_waiting',
  ATTENDING: 'status_attending',
  IDLE: 'status_idle',
  RESOLVED: 'status_resolved',
})

export const CASE_RESOLUTION = Object.freeze({
  OK: 'result_ok',
  NOK: 'result_nok',
  NOT_SOLVED: 'result_not_solved',
  BANNED: 'result_banned',
})
