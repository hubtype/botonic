// TODO: This file contains all the legacy types we had in index.ts. After some refactors, we should be able to get rid of many of them.

import { BotonicEvent } from './events'

export enum CASE_STATUS {
  WAITING = 'status_waiting',
  ATTENDING = 'status_attending',
  IDLE = 'status_idle',
  RESOLVED = 'status_resolved',
}

export type CaseStatusType =
  | CASE_STATUS.ATTENDING
  | CASE_STATUS.IDLE
  | CASE_STATUS.RESOLVED
  | CASE_STATUS.WAITING

export enum CASE_RESOLUTION {
  OK = 'result_ok',
  NOK = 'result_nok',
  NOT_SOLVED = 'result_not_solved',
  BANNED = 'result_banned',
}

export type CaseResolution =
  | CASE_RESOLUTION.BANNED
  | CASE_RESOLUTION.NOK
  | CASE_RESOLUTION.NOT_SOLVED
  | CASE_RESOLUTION.OK

export enum PROVIDER {
  APPLE = 'apple',
  DEV = 'dev',
  FACEBOOK = 'facebook',
  GENERIC = 'generic',
  INSTAGRAM = 'instagram',
  INTERCOM = 'intercom',
  SMOOCH = 'smooch',
  TELEGRAM = 'telegram',
  TWITTER = 'twitter',
  WEBCHAT = 'webchat',
  WECHAT = 'wechat',
  WHATSAPP = 'whatsapp',
}

export type ProviderType =
  | PROVIDER.DEV
  | PROVIDER.FACEBOOK
  | PROVIDER.GENERIC
  | PROVIDER.INSTAGRAM
  | PROVIDER.INTERCOM
  | PROVIDER.SMOOCH
  | PROVIDER.TELEGRAM
  | PROVIDER.TWITTER
  | PROVIDER.WEBCHAT
  | PROVIDER.WECHAT
  | PROVIDER.WHATSAPP

export enum INPUT {
  TEXT = 'text',
  POSTBACK = 'postback',
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  LOCATION = 'location',
  CONTACT = 'contact',
  BUTTON_MESSAGE = 'buttonmessage',
  CAROUSEL = 'carousel',
  CUSTOM = 'custom',
  WEBCHAT_SETTINGS = 'webchatsettings',
  WHATSAPP_TEMPLATE = 'whatsapptemplate',
  RAW = 'raw',
  CHAT_EVENT = 'chatevent',
  WHATSAPP_BUTTON_LIST = 'whatsapp-button-list',
  WHATSAPP_CTA_URL_BUTTON = 'whatsapp-cta-url-button',
}

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

export interface ResolvedPlugin extends Plugin {
  id: string
  name: string
  config: any
}
export type ResolvedPlugins = Record<string, ResolvedPlugin>

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
  | typeof INPUT.CHAT_EVENT
  | typeof INPUT.WHATSAPP_BUTTON_LIST
  | typeof INPUT.WHATSAPP_CTA_URL_BUTTON

export interface IntentResult {
  intent: string
  confidence: number
}

/** Generated by Translation plugins: GoogleTranslation **/
export interface Translations {
  [languageCode: string]: string
}

/** Fields set by NLU plugins: Luis, Dialogflow, ... **/
export interface NluResult {
  // the name of the highest confidence intent
  confidence: number
  intent: string
  intents: IntentResult[]
  hasSense?: boolean
  language: string
  // entity recognition results in the format provided by the NLU engine
  entities?: any
  translations: Translations
}

export interface Input extends Partial<NluResult> {
  text?: string
  src?: string
  data?: string
  path?: string
  payload?: string
  referral?: string
  type: InputType
  context?: {
    campaign?: Campaign
  }
}

export interface Campaign {
  id: string
  name: string
  status: string
  start_date: string
  end_date: string
  bot_path: string
  template_name: string
}

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
export interface HubtypeCaseContactReason {
  id: string
  name: string
  project_id: string
}

export interface Session {
  bot: {
    id: string
    name?: string
  }
  __locale?: string
  __retries: number
  _access_token: string
  _hubtype_api: string
  is_first_interaction: boolean
  last_session?: any
  organization_id: string
  organization: string
  user: SessionUser
  // after handoff
  _botonic_action?: string
  _hubtype_case_status?: CaseStatusType
  _hubtype_case_id?: string
  _hubtype_case_typification?: string
  _hubtype_case_contact_reasons?: HubtypeCaseContactReason[]
  _shadowing?: boolean
  external?: any
  zendesk_ticket_id?: string
}

export type InputMatcher = (input: Input) => boolean
export type ParamsMatcher =
  | { [key: string]: string }
  | ((params: { [key: string]: string }) => boolean)
export type SessionMatcher = (session: Session) => boolean
export type RequestMatcher = (request: BotRequest) => boolean
export type StringMatcher = RegExp | string | ((data: string) => boolean)

export type RouteMatcher =
  | InputMatcher
  | ParamsMatcher
  | RequestMatcher
  | SessionMatcher
  | StringMatcher

export interface Route {
  action?: any
  childRoutes?: Route[]
  lastRoutePath?: string
  ignoreRetry?: boolean
  path: RoutePath
  redirect?: string
  retry?: number

  // matchers
  input?: InputMatcher
  intent?: StringMatcher
  params?: ParamsMatcher
  payload?: StringMatcher
  request?: RequestMatcher
  session?: SessionMatcher
  text?: StringMatcher
  data?: StringMatcher
  type?: StringMatcher
}

export type Routes<R = Route> = R[] | ((_: BotRequest) => R[])

export interface BotRequest {
  input: Input
  lastRoutePath: RoutePath
  session: Session
}

/** The response of the bot for the triggered actions, which can be
 * the one matched by the routes, the default action and the retry actions.
 * See Response at @botonic/react's index.d.ts for the React type
 * */
export interface BotResponse extends BotRequest {
  response: any
}

export interface PluginPreRequest extends BotRequest {
  plugins: ResolvedPlugins
}
export interface PluginPostRequest extends BotResponse {
  plugins: ResolvedPlugins
}

export interface Plugin {
  post?(request: PluginPostRequest): void | Promise<void>
  pre?(request: PluginPreRequest): void | Promise<void>
}

export interface Params {
  [key: string]: any
}

export type Nullable<T> = T | null

export type Action = Nullable<() => any>
export type RoutePath = Nullable<string>

export interface ProcessInputResult {
  action: Action
  emptyAction: Action
  fallbackAction: Action
  lastRoutePath: RoutePath
  params: Params
}

export type MatchedValue = boolean | RegExpExecArray | null

export type RoutingState = {
  currentRoute: Nullable<Route>
  matchedRoute: Nullable<Route>
  params: Params
  isFlowBroken: boolean
}

export interface RouteParams {
  route: Nullable<Route>
  params: Params
}
export interface PathParams {
  path: RoutePath
  params: Params
}

export type MatchingProp =
  | 'text'
  | 'payload'
  | 'intent'
  | 'type'
  | 'input'
  | 'session'
  | 'request'

export type Matcher = string | RegExp | ((args) => boolean)
