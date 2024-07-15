import { Inspector } from './debug'
import { getString } from './i18n'
import {
  ActionRequest,
  BotRequest,
  BotResponse,
  INPUT,
  Input,
  Locales,
  ProcessInputResult,
  ResolvedPlugins,
  Route,
  Routes,
  Session,
} from './models'
import { loadPlugins, runPlugins } from './plugins'
import { getComputedRoutes, Router } from './routing'

export interface CoreBotConfig {
  appId?: string
  defaultDelay?: number
  defaultRoutes?: Route[]
  defaultTyping?: number
  inspector?: Inspector
  locales: Locales
  plugins?: any
  renderer: any
  routes: Routes
  theme?: any
}
export class CoreBot {
  appId?: string
  defaultDelay: number
  defaultRoutes: Route[]
  defaultTyping: number
  inspector: Inspector
  locales: Locales
  plugins: ResolvedPlugins
  renderer: any
  rootElement: any
  router: Router | null
  routes: Routes
  theme?: any

  constructor({
    renderer,
    routes,
    locales,
    theme,
    plugins,
    appId,
    defaultTyping,
    defaultDelay,
    defaultRoutes,
    inspector,
  }: CoreBotConfig) {
    this.renderer = renderer
    this.plugins = loadPlugins(plugins)
    this.theme = theme || {}
    this.defaultTyping = defaultTyping ?? 0.6
    this.defaultDelay = defaultDelay ?? 0.4
    this.locales = locales
    this.appId = appId || undefined
    this.rootElement = null
    this.inspector = inspector || new Inspector()
    this.routes = routes
    this.defaultRoutes = defaultRoutes || []
    this.router =
      this.routes instanceof Function
        ? null
        : new Router(
            [...this.routes, ...this.defaultRoutes],
            this.inspector.routeInspector
          )
  }

  getString(id: string, session: Session): string {
    // @ts-ignore
    return getString(this.locales, session.__locale, id)
  }

  setLocale(locale: string, session: Session): void {
    session.__locale = locale
  }

  async input({
    input,
    session,
    lastRoutePath,
  }: BotRequest): Promise<BotResponse> {
    const output = await this.runInput({ input, session, lastRoutePath })
    if (session._botonic_action?.startsWith('create_test_integration_case:')) {
      return await this.runFollowUpTestIntegrationInput(output, {
        input,
        session,
        lastRoutePath,
      })
    }

    return output
  }

  private async runInput({
    input,
    session,
    lastRoutePath,
  }: BotRequest): Promise<BotResponse> {
    session = session || {}
    if (!session.__locale) session.__locale = 'en'

    if (input.type === INPUT.CHAT_EVENT) {
      return {
        input,
        session,
        lastRoutePath,
        response: [],
      }
    }

    const actionRequest: ActionRequest = {
      defaultDelay: this.defaultDelay,
      defaultTyping: this.defaultTyping,
      input,
      lastRoutePath,
      params: {},
      plugins: this.plugins,
      session,
    }

    await this.runPrePlugins(actionRequest)

    const output = await this.getOutput(actionRequest)

    const response = await this.renderer({
      request: this.createRequestFromOutput(
        { input, session, lastRoutePath },
        output
      ),
      actions: [output.fallbackAction, output.action, output.emptyAction],
    })

    actionRequest.lastRoutePath = output.lastRoutePath

    await this.runPostPlugins(actionRequest, response)

    session.is_first_interaction = false

    return {
      input: actionRequest.input,
      session: actionRequest.session,
      lastRoutePath: actionRequest.lastRoutePath,
      response,
    }
  }

  private async runPrePlugins(actionRequest: ActionRequest) {
    if (this.plugins) {
      await runPlugins(actionRequest, 'pre', undefined)
    }
  }

  private async getOutput(
    actionRequest: ActionRequest
  ): Promise<ProcessInputResult> {
    await this.setRouter(actionRequest)

    const output = (this.router as Router).processInput(
      actionRequest.input,
      actionRequest.session,
      actionRequest.lastRoutePath
    )
    return output
  }

  private async setRouter(actionRequest: ActionRequest) {
    if (this.routes instanceof Function) {
      this.router = new Router(
        [
          ...(await getComputedRoutes(this.routes, actionRequest)),
          ...this.defaultRoutes,
        ],
        this.inspector.routeInspector
      )
    }
  }

  private createRequestFromOutput(
    { input, session, lastRoutePath }: BotRequest,
    output: ProcessInputResult
  ): ActionRequest & {
    getString: (stringId: string) => string
    setLocale: (locale: string) => void
  } {
    return {
      getString: (stringId: string) => this.getString(stringId, session),
      setLocale: (locale: string) => this.setLocale(locale, session),
      defaultDelay: this.defaultDelay,
      defaultTyping: this.defaultTyping,
      input,
      lastRoutePath,
      params: output.params || {},
      plugins: this.plugins || {},
      session: session || {},
    }
  }

  private async runPostPlugins(actionRequest: ActionRequest, response: any) {
    if (this.plugins) {
      await runPlugins(actionRequest, 'post', response)
    }
  }

  private async runFollowUpTestIntegrationInput(
    previousResponse: BotResponse,
    { input, session, lastRoutePath }: BotRequest
  ) {
    const [_, onFinishPayloadId] = session._botonic_action!.split(
      'create_test_integration_case:'
    )
    const inputWithOnFinishPayload: Input = {
      ...input,
      payload: onFinishPayloadId,
      type: INPUT.POSTBACK,
      data: undefined,
      text: undefined,
    }

    session._botonic_action = undefined

    const followUp = await this.runInput({
      input: inputWithOnFinishPayload,
      session,
      lastRoutePath,
    })

    return {
      input: followUp.input,
      response: previousResponse.response.concat(followUp.response),
      session,
      lastRoutePath: followUp.lastRoutePath,
    }
  }
}
