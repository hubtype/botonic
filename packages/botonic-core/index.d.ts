export type Locales = { [id: string]: string | string[] | Locales }

export interface Input {
  // text, postback...
  type: string
  payload?: string
  data?: string

  /** Fields set by NLU plugins: Luis, Dialogflow, ... **/
  // the name of the highest confidence intent
  intent?: string
  confidence?: number
  intents?: [{ intent: string; confidence: number }]
  // entity recognition results in the format provided by the NLU engine
  entities?: any
}

type StringMatcher = RegExp | string | ((data: string) => boolean)

export interface Session {
  is_first_interaction?: boolean
  last_session?: any
  user: {
    id: string
    // login
    username?: string
    // person name
    name?: string
    // whatsapp, telegram,...
    provider?: string
    // The provider's user id
    provider_id?: string
    extra_data?: any
  }
  bot: {
    id: string
    name?: string
  }
  __locale?: string
  __retries?: number
}

export interface Route {
  path: StringMatcher
  payload?: StringMatcher
  text?: StringMatcher
  type?: StringMatcher
  intent?: StringMatcher
  input?: (input: Input) => boolean
  session?: (session: Session) => boolean
  action: React.ReactNode
}

type Routes = Route[] | ((_: { input: Input; session: Session }) => Route[])

// Desk
export declare function humanHandOff(
  session: Session,
  queue_name: string,
  on_finish: { payload?: any; path?: any }
): Promise<void>

export declare function getOpenQueues(
  session: Session
): Promise<{ queues: string[] }>

export declare function storeCaseRating(
  session: Session,
  rating: number
): Promise<any>

export interface Plugin {
  pre(_: { input: Input; session: Session; lastRoutePath: string })
  post(_: {
    input: Input
    session: Session
    lastRoutePath: string
    response: string
  })
}

interface BotOptions {
  routes: Routes
  locales: Locales
  integrations?: { [id: string]: any }
  theme?: string
  /** The plugin configurations */
  plugins?: { [id: string]: any }
  appId?: string
  defaultTyping?: number
  defaultDelay?: number
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

  input(_: {
    input: Input
    session?: Session
    lastRoutePath: string
  }): {
    input: Input
    response: React.ReactNode
    session: Session
    lastRoutePath: string
  }
}
