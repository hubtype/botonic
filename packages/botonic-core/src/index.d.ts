export interface Locales {
  [id: string]: string | string[] | Locales
}

interface PluginConstructor<T> {
  new (arg: T): Plugin
}

export interface PluginConfig<T> {
  id: string
  resolve: { default: PluginConstructor<T> }
  options?: T
}

export const INPUT: {
  TEXT: 'text'
  POSTBACK: 'postback'
  AUDIO: 'audio'
  IMAGE: 'image'
  VIDEO: 'video'
  DOCUMENT: 'document'
  LOCATION: 'location'
  CONTACT: 'contact'
  BUTTON_MESSAGE: 'buttonmessage'
  CAROUSEL: 'carousel'
  CUSTOM: 'custom'
  WEBCHAT_SETTINGS: 'webchat_settings'
}

export type InputType =
  | typeof INPUT.TEXT
  | typeof INPUT.POSTBACK
  | typeof INPUT.AUDIO
  | typeof INPUT.IMAGE
  | typeof INPUT.VIDEO
  | typeof INPUT.DOCUMENT
  | typeof INPUT.LOCATION
  | typeof INPUT.CONTACT
  | typeof INPUT.BUTTON_MESSAGE
  | typeof INPUT.CAROUSEL
  | typeof INPUT.CUSTOM
  | typeof INPUT.WEBCHAT_SETTINGS

export interface Input {
  type: InputType
  payload?: string
  data?: string
  path?: string

  /** Fields set by NLU plugins: Luis, Dialogflow, ... **/
  // the name of the highest confidence intent
  intent?: string
  confidence?: number
  intents?: [{ intent: string; confidence: number }]
  // entity recognition results in the format provided by the NLU engine
  entities?: any
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
  provider_id?: string
  extra_data?: any
}

export interface Session {
  is_first_interaction?: boolean
  last_session?: any
  user: SessionUser
  bot: {
    id: string
    name?: string
  }
  __locale?: string
  __retries?: number
}

type StringMatcher = RegExp | string | ((data: string) => boolean)
type ParamsMatcher =
  | { [key: string]: string }
  | ((params: { [key: string]: string }) => boolean)
type SessionMatcher = (session: Session) => boolean
type InputMatcher = (input: Input) => boolean
type RouteMatcher =
  | StringMatcher
  | ParamsMatcher
  | SessionMatcher
  | InputMatcher

export interface Route {
  path?: StringMatcher
  action?: any
  retryAction?: any
  redirect?: string
  childRoutes?: Route[]

  // matchers
  payload?: StringMatcher
  text?: StringMatcher
  params?: ParamsMatcher
  type?: StringMatcher
  intent?: StringMatcher
  input?: InputMatcher
  session?: SessionMatcher
}

type Routes<R = Route> = R[] | ((_: { input: Input; session: Session }) => R[])

// Desk

export class HandOffBuilder {
  constructor(session: Session)

  withQueue(queueNameOrId: string): HandOffBuilder

  withOnFinishPayload(payload: string): HandOffBuilder
  withOnFinishPath(path: string): HandOffBuilder
  withAgentEmail(email: string): HandOffBuilder
  withAgentId(agentId: string): HandOffBuilder
  withNote(note: string): HandOffBuilder
  withCaseInfo(caseInfo: string): HandOffBuilder
  withShadowing(shadowing?: boolean): HandOffBuilder

  handOff(): Promise<void>
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
): Promise<any>

export declare function getAvailableAgentsByQueue(
  session: Session,
  queueId: string
): Promise<{ agents: string[] }>

export interface HubtypeAgentsInfo {
  email: string
  attending_count: number
  status: string
  last_message_sent: string
}

export declare function getAvailableAgents(
  session: Session
): Promise<{ agents: HubtypeAgentsInfo[] }>

interface VacationRange {
  id: number
  start_date: number // timestamp
  end_date: number // timestamp
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
  session: Session
  lastRoutePath: string
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
  pre(pluginRequest: PluginPreRequest): void

  post(_: PluginPostRequest): void
}

export interface BotOptions {
  routes: Routes
  locales: Locales
  integrations?: { [id: string]: any }
  theme?: string
  /** The plugin configurations */
  plugins?: { [id: string]: any }
  appId?: string
  defaultTyping?: number
  defaultDelay?: number
  defaultRoutes?: Route[]
  inspector?: Inspector
}

export class CoreBot {
  routes: Routes
  locales: Locales
  integrations?: { [id: string]: any }
  theme?: string
  plugins: { [id: string]: Plugin }
  defaultTyping: number
  defaultDelay: number

  constructor(options: BotOptions)

  getString(stringID: string, session: Session): string

  setLocale(locale: string, session: Session): void

  input(request: BotRequest): BotResponse
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
