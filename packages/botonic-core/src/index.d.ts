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

export const INPUT: {
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
}

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

export const PROVIDER: {
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
}

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

export interface Session {
  bot: {
    id: string
    name?: string
  }
  __locale?: string
  __retries?: number
  _shadowing?: boolean
  is_first_interaction?: boolean
  last_session?: any
  organization?: string
  user: SessionUser
}

type InputMatcher = (input: Input) => boolean
type ParamsMatcher =
  | { [key: string]: string }
  | ((params: { [key: string]: string }) => boolean)
type SessionMatcher = (session: Session) => boolean
type RequestMatcher = (request: BotRequest) => boolean
type StringMatcher = RegExp | string | ((data: string) => boolean)

type RouteMatcher =
  | InputMatcher
  | ParamsMatcher
  | RequestMatcher
  | SessionMatcher
  | StringMatcher

export interface Route {
  action?: any
  childRoutes?: Route[]
  path?: StringMatcher
  redirect?: string
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

type RouteRequest = { input: Input; session: Session }
type Routes<R = Route> = R[] | ((_: RouteRequest) => R[])

// Desk

export class HandOffBuilder {
  constructor(session: Session)
  handOff(): Promise<void>
  withAgentEmail(email: string): HandOffBuilder
  withAgentId(agentId: string): HandOffBuilder
  withCaseInfo(caseInfo: string): HandOffBuilder
  withNote(note: string): HandOffBuilder
  withOnFinishPath(path: string): HandOffBuilder
  withOnFinishPayload(payload: string): HandOffBuilder
  withQueue(queueNameOrId: string): HandOffBuilder
  withShadowing(shadowing?: boolean): HandOffBuilder
}

/**
 * @deprecated use {@link HandOffBuilder} class instead
 */
export declare function humanHandOff(
  session: Session,
  queueNameOrId: string, // queue_name for backward compatibility, queue_id for new versions
  onFinish: { payload?: string; path?: string }
): Promise<void>

export declare function getOpenQueues(
  session: Session
): Promise<{ queues: string[] }>

export declare function storeCaseRating(
  session: Session,
  rating: number
): Promise<{ status: string }>

export declare function getAvailableAgentsByQueue(
  session: Session,
  queueId: string
): Promise<{ agents: string[] }>

export interface HubtypeAgentsInfo {
  attending_count: number
  email: string
  idle_count: number
  last_message_sent: string
  status: string
}

export declare function getAvailableAgents(
  session: Session
): Promise<{ agents: HubtypeAgentsInfo[] }>

interface VacationRange {
  end_date: number // timestamp
  id: number
  start_date: number // timestamp
}

export declare function getAgentVacationRanges(
  session: Session,
  agentParams: { agentId?: string; agentEmail?: string }
): Promise<{ vacation_ranges: VacationRange[] }>

export declare function cancelHandoff(
  session: Session,
  typification?: string
): void

export declare function deleteUser(session: Session): void

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

export interface BotOptions {
  appId?: string
  defaultDelay?: number
  defaultRoutes?: Route[]
  defaultTyping?: number
  inspector?: Inspector
  integrations?: { [id: string]: any }
  locales: Locales
  routes: Routes
  theme?: string
  /** The plugin configurations */
  plugins?: { [id: string]: any }
}

export class CoreBot {
  defaultDelay: number
  defaultTyping: number
  integrations?: { [id: string]: any }
  locales: Locales
  plugins: { [id: string]: Plugin }
  routes: Routes
  theme?: string

  constructor(options: BotOptions)
  getString(stringID: string, session: Session): string
  input(request: BotRequest): BotResponse
  setLocale(locale: string, session: Session): void
}

// Debug

export class RouteInspector {
  routeMatched(
    route: Route,
    routeKey: string,
    routeValue: RouteMatcher,
    input: Input
  ): void
  routeNotMatched(
    route: Route,
    routeKey: string,
    routeValue: RouteMatcher,
    input: Input
  ): void
}

export class FocusRouteInspector extends RouteInspector {
  focusOnlyOnRoutes(focusRoutePaths: string[]): FocusRouteInspector
  focusOnlyOnMatches(): FocusRouteInspector
}

export class LogRouteInspector extends FocusRouteInspector {}

export class Inspector {
  constructor(routeInspector: RouteInspector | undefined)

  getRouteInspector(): RouteInspector
}

export function isBrowser(): boolean
export function isMobile(mobileBreakpoint?: number): boolean
export function isNode(): boolean
