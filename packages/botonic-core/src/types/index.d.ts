export { Providers } from './constants'
export { BotOptions, CoreBot } from './core-bot'
export * from './debug'
export * from './handoff'
export { HubtypeService } from './hubtype-service'
export { getString } from './i18n'
export { Router } from './router'
export * from './utils'

export interface Locales {
  [id: string]: string | string[] | Locales
}

interface PluginConstructor<T> {
  new (arg: T): Plugin
}

export interface PluginConfig<T> {
  id: string
  options?: T
  resolve: { default: PluginConstructor<T> }
}

export const INPUT: Readonly<{
  AUDIO: 'audio'
  BUTTON_MESSAGE: 'buttonmessage'
  CAROUSEL: 'carousel'
  CONTACT: 'contact'
  CUSTOM: 'custom'
  DOCUMENT: 'document'
  IMAGE: 'image'
  LOCATION: 'location'
  POSTBACK: 'postback'
  TEXT: 'text'
  VIDEO: 'video'
  WEBCHAT_SETTINGS: 'webchatsettings'
  WHATSAPP_TEMPLATE: 'whatsapptemplate'
}>

export type InputType =
  | typeof INPUT.AUDIO
  | typeof INPUT.BUTTON_MESSAGE
  | typeof INPUT.CAROUSEL
  | typeof INPUT.CONTACT
  | typeof INPUT.CUSTOM
  | typeof INPUT.DOCUMENT
  | typeof INPUT.IMAGE
  | typeof INPUT.LOCATION
  | typeof INPUT.POSTBACK
  | typeof INPUT.TEXT
  | typeof INPUT.VIDEO
  | typeof INPUT.WEBCHAT_SETTINGS
  | typeof INPUT.WHATSAPP_TEMPLATE

export interface IntentResult {
  intent: string
  confidence: number
}

/** Fields set by NLU plugins: Luis, Dialogflow, ... **/
export interface NluResult {
  // the name of the highest confidence intent
  confidence: number
  intent: string
  intents: IntentResult[]
  language: string
  // entity recognition results in the format provided by the NLU engine
  entities?: any
}

export interface Input extends Partial<NluResult> {
  data?: string
  path?: string
  payload?: string
  type: InputType
}

export const PROVIDER: Readonly<{
  DEV: 'dev'
  FACEBOOK: 'facebook'
  GENERIC: 'generic'
  INTERCOM: 'intercom'
  SMOOCH: 'smooch'
  TELEGRAM: 'telegram'
  TWITTER: 'twitter'
  WEBCHAT: 'webchat'
  WECHAT: 'wechat'
  WHATSAPP: 'whatsapp'
}>

export type ProviderType =
  | typeof PROVIDER.DEV
  | typeof PROVIDER.FACEBOOK
  | typeof PROVIDER.GENERIC
  | typeof PROVIDER.INTERCOM
  | typeof PROVIDER.SMOOCH
  | typeof PROVIDER.TELEGRAM
  | typeof PROVIDER.TWITTER
  | typeof PROVIDER.WEBCHAT
  | typeof PROVIDER.WECHAT
  | typeof PROVIDER.WHATSAPP

export interface SessionUser {
  id: string
  // login
  username?: string
  // person name
  name?: string
  // whatsapp, telegram,...
  provider: ProviderType
  // The provider's user id
  extra_data?: any
  imp_id?: string
  provider_id?: string
}

// eslint-disable @typescript-eslint/naming-convention
export interface Session {
  bot: {
    id: string
    name?: string
  }
  __locale?: string
  __retries?: number
  is_first_interaction: boolean
  last_session?: any
  organization?: string
  user: SessionUser
  // after handoff
  _hubtype_case_status?: CaseStatusType
  _hubtype_case_typification?: string
  _shadowing?: boolean
}
// eslint-enable @typescript-eslint/naming-convention

type InputMatcher = (input: Input) => boolean
type ParamsMatcher =
  | { [key: string]: string }
  | ((params: { [key: string]: string }) => boolean)
type SessionMatcher = (session: Session) => boolean
type RequestMatcher = (request: BotRequest) => boolean
type StringMatcher = RegExp | string | ((data: string) => boolean)

export type RouteMatcher =
  | InputMatcher
  | ParamsMatcher
  | RequestMatcher
  | SessionMatcher
  | StringMatcher

export interface Route {
  action?: any
  childRoutes?: Route[]
  defaultAction?: any
  lastRoutePath?: string
  ignoreRetry?: boolean
  path?: StringMatcher
  redirect?: string
  retry?: number
  retryAction?: any

  // matchers
  input?: InputMatcher
  intent?: StringMatcher
  params?: ParamsMatcher
  payload?: StringMatcher
  request?: RequestMatcher
  session?: SessionMatcher
  text?: StringMatcher
  type?: StringMatcher
}

export type Routes<R = Route> = R[] | ((_: BotRequest) => R[])

// Desk

export const CASE_STATUS: Readonly<{
  ATTENDING: 'status_attending'
  IDLE: 'status_idle'
  RESOLVED: 'status_resolved'
  WAITING: 'status_waiting'
}>

export type CaseStatusType =
  | typeof CASE_STATUS.ATTENDING
  | typeof CASE_STATUS.IDLE
  | typeof CASE_STATUS.RESOLVED
  | typeof CASE_STATUS.WAITING

export const CASE_RESOLUTION: Readonly<{
  BANNED: 'result_banned'
  NOK: 'result_nok'
  NOT_SOLVED: 'result_not_solved'
  OK: 'result_ok'
}>

export type CaseResolution =
  | typeof CASE_RESOLUTION.BANNED
  | typeof CASE_RESOLUTION.NOK
  | typeof CASE_RESOLUTION.NOT_SOLVED
  | typeof CASE_RESOLUTION.OK

export interface BotRequest {
  input: Input
  lastRoutePath: string
  session: Session
}

/** The response of the bot for the triggered actions, which can be
 * the one matched by the routes, the default action and the retry actions.
 * See Response at @botonic/react's index.d.ts for the React type
 * */
export interface BotResponse extends BotRequest {
  response: any
}

export type PluginPreRequest = BotRequest
export type PluginPostRequest = BotResponse

export interface Plugin {
  post(_: PluginPostRequest): void
  pre(pluginRequest: PluginPreRequest): void
}

export type Params = { [key: string]: string }
