import * as React from 'react'
import * as core from '@botonic/core'

/**
 * See @botonic/core's Response for the description of the Response's semantics*/
export interface BotResponse extends core.BotRequest {
  response: [React.ReactNode]
}

export interface Route extends core.Route {
  action?: typeof React.Component
  retryAction?: typeof React.Component
}
type Routes = core.Routes<Route>

export interface BotOptions extends core.BotOptions {
  routes: Routes
}

export class ReactBot extends core.CoreBot {
  renderReactActions({
    request: ActionRequest,
    actions,
  }): Promise<React.ReactNode>
}

export class NodeApp {
  constructor(options: BotOptions)
  bot: ReactBot

  renderNode(args): string
  input(request: core.BotRequest): BotResponse
}

// Parameters of the actions' botonicInit method
export interface ActionRequest {
  session: core.Session
  params: { [key: string]: string }
  input: core.Input
  plugins: { [id: string]: core.Plugin }
  defaultTyping: number
  defaultDelay: number
  lastRoutePath: string
}

export class BotonicInputTester {
  constructor(app: NodeApp)

  text(
    inp: string,
    session?: core.Session,
    lastRoutePath?: string
  ): Promise<string>

  payload(
    inp: string,
    session?: core.Session,
    lastRoutePath?: string
  ): Promise<string>
}

export class BotonicOutputTester {
  constructor(app: NodeApp)

  text(out: string, replies?: any): Promise<string>
}

export interface RequestContextInterface extends ActionRequest {
  getString: (stringId: string) => string
  setLocale: (locale: string) => string
}

export const RequestContext: React.Context<RequestContextInterface>

export interface CustomMessageType {
  customTypeName: string
}

export function msgToBotonic(
  msg: any,
  customMessageTypes?: CustomMessageType[]
): React.ReactNode

export function msgsToBotonic(
  msgs: any | any[],
  customMessageTypes?: CustomMessageType[]
): React.ReactNode

export * from './components'
