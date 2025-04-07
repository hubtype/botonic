import { Inspector } from './debug'
import { getString } from './i18n'
import {
  BotonicAction,
  BotRequest,
  BotResponse,
  INPUT,
  Input,
  Locales,
  PluginConfig,
  ProcessInputResult,
  RequestCoreContext,
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
  plugins?: PluginConfig<any>[]
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
    defaultTyping = 0.6,
    defaultDelay = 0.4,
    defaultRoutes,
    inspector,
  }: CoreBotConfig) {
    this.renderer = renderer
    this.plugins = loadPlugins(plugins)
    this.theme = theme || {}
    this.defaultTyping = defaultTyping
    this.defaultDelay = defaultDelay
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
    const requestCoreContext: RequestCoreContext = {
      getString: (stringId: string) => this.getString(stringId, session),
      setLocale: (locale: string) => this.setLocale(locale, session),
      params: {},
      lastRoutePath,
      plugins: this.plugins,
      defaultTyping: this.defaultTyping,
      defaultDelay: this.defaultDelay,
      input,
      session,
    }

    const output = await this.runInput(requestCoreContext)

    if (session._botonic_action?.startsWith(BotonicAction.Redirect)) {
      return await this.runRedirectAction(output, requestCoreContext)
    }

    return output
  }

  private async runInput(
    requestCoreContext: RequestCoreContext
  ): Promise<BotResponse> {
    requestCoreContext.session = requestCoreContext.session || {}
    if (!requestCoreContext.session.__locale)
      requestCoreContext.session.__locale = 'en'

    if (requestCoreContext.input.type === INPUT.CHAT_EVENT) {
      return {
        input: requestCoreContext.input,
        session: requestCoreContext.session,
        lastRoutePath: requestCoreContext.lastRoutePath,
        response: [],
      }
    }

    await this.runPrePlugins(requestCoreContext)

    const output = await this.getOutput(requestCoreContext)
    requestCoreContext = this.updateRequestFromOutput(
      requestCoreContext,
      output
    )
    const response = await this.renderer({
      request: requestCoreContext,
      actions: [output.fallbackAction, output.action, output.emptyAction],
    })

    await this.runPostPlugins(requestCoreContext, response)

    requestCoreContext.session.is_first_interaction = false

    return {
      input: requestCoreContext.input,
      response,
      session: requestCoreContext.session,
      lastRoutePath: requestCoreContext.lastRoutePath,
    }
  }

  private async runPrePlugins(requestCoreContext: RequestCoreContext) {
    if (this.plugins) {
      await runPlugins({ requestCoreContext, mode: 'pre' })
    }
  }

  private async getOutput(
    requestCoreContext: RequestCoreContext
  ): Promise<ProcessInputResult> {
    await this.setRouter(requestCoreContext)

    const output = (this.router as Router).processInput(
      requestCoreContext.input,
      requestCoreContext.session,
      requestCoreContext.lastRoutePath
    )
    return output
  }

  private async setRouter(requestCoreContext: RequestCoreContext) {
    if (this.routes instanceof Function) {
      this.router = new Router(
        [
          ...(await getComputedRoutes(this.routes, requestCoreContext)),
          ...this.defaultRoutes,
        ],
        this.inspector.routeInspector
      )
    }
  }

  private updateRequestFromOutput(
    requestCoreContext: RequestCoreContext,
    output: ProcessInputResult
  ): RequestCoreContext {
    return {
      ...requestCoreContext,
      params: output.params || {},
      lastRoutePath: output.lastRoutePath,
    }
  }

  private async runPostPlugins(
    requestCoreContext: RequestCoreContext,
    response: any
  ) {
    if (this.plugins) {
      await runPlugins({
        requestCoreContext,
        mode: 'post',
        response,
      })
    }
  }

  private async runRedirectAction(
    previousResponse: BotResponse,
    requestCoreContext: RequestCoreContext,
    numOfRedirects: number = 0
  ) {
    if (numOfRedirects > 10) {
      throw new Error('Maximum BotAction recursive calls reached (10)')
    }

    const nextPayload = requestCoreContext.session._botonic_action?.split(
      `${BotonicAction.Redirect}:`
    )[1]

    const inputWithBotActionPayload: Input = {
      ...requestCoreContext.input,
      payload: nextPayload,
      type: INPUT.POSTBACK,
      data: undefined,
      text: undefined,
    }

    requestCoreContext.session._botonic_action = undefined
    requestCoreContext.input = inputWithBotActionPayload

    const followUp = await this.runInput(requestCoreContext)

    const response = {
      input: followUp.input,
      response: previousResponse.response.concat(followUp.response),
      session: requestCoreContext.session,
      lastRoutePath: followUp.lastRoutePath,
    }

    // Recursive call to handle multiple bot actions in a row
    if (response.session._botonic_action?.startsWith(BotonicAction.Redirect)) {
      return await this.runRedirectAction(
        response,
        requestCoreContext,
        numOfRedirects + 1
      )
    }

    return response
  }
}
