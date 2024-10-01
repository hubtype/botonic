import { Inspector } from './debug'
import { getString } from './i18n'
import {
  BotonicAction,
  BotRequest,
  BotResponse,
  INPUT,
  Input,
  Locales,
  ProcessInputResult,
  ResolvedPlugins,
  Route,
  RoutePath,
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
  defaultDelay?: number
  defaultRoutes: Route[]
  defaultTyping?: number
  inspector: Inspector
  locales: Locales
  plugins?: ResolvedPlugins
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
    this.defaultTyping =
      typeof defaultTyping !== 'undefined' ? defaultTyping : 0.6
    this.defaultDelay = typeof defaultDelay !== 'undefined' ? defaultDelay : 0.4
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

    if (session._botonic_action?.startsWith(BotonicAction.Redirect)) {
      return await this.runRedirectAction(output, {
        input,
        session,
        lastRoutePath,
      })
    }

    if (session._botonic_action?.startsWith(BotonicAction.CreateTestCase)) {
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

    await this.runPrePlugins(input, session, lastRoutePath)

    const output = await this.getOutput(input, session, lastRoutePath)

    const response = await this.renderer({
      request: this.createRequestFromOutput(
        { input, session, lastRoutePath },
        output
      ),
      actions: [output.fallbackAction, output.action, output.emptyAction],
    })

    lastRoutePath = output.lastRoutePath

    await this.runPostPlugins(input, session, lastRoutePath, response)

    session.is_first_interaction = false

    return {
      input,
      response,
      session,
      lastRoutePath,
    }
  }

  private async runPrePlugins(
    input: Input,
    session: Session,
    lastRoutePath: RoutePath
  ) {
    if (this.plugins) {
      await runPlugins(
        this.plugins,
        'pre',
        input,
        session,
        lastRoutePath,
        undefined
      )
    }
  }

  private async getOutput(
    input: Input,
    session: Session,
    lastRoutePath: RoutePath
  ): Promise<ProcessInputResult> {
    await this.setRouter(input, session, lastRoutePath)

    const output = (this.router as Router).processInput(
      input,
      session,
      lastRoutePath
    )
    return output
  }

  private async setRouter(
    input: Input,
    session: Session,
    lastRoutePath: RoutePath
  ) {
    if (this.routes instanceof Function) {
      this.router = new Router(
        [
          ...(await getComputedRoutes(this.routes, {
            input,
            session,
            lastRoutePath,
          })),
          ...this.defaultRoutes,
        ],
        this.inspector.routeInspector
      )
    }
  }

  private createRequestFromOutput(
    { input, session, lastRoutePath }: BotRequest,
    output: ProcessInputResult
  ) {
    return {
      getString: (stringId: string) => this.getString(stringId, session),
      setLocale: (locale: string) => this.setLocale(locale, session),
      session: session || {},
      params: output.params || {},
      input,
      plugins: this.plugins,
      defaultTyping: this.defaultTyping,
      defaultDelay: this.defaultDelay,
      lastRoutePath,
    }
  }

  private async runPostPlugins(
    input: Input,
    session: Session,
    lastRoutePath: RoutePath,
    response: any
  ) {
    if (this.plugins) {
      await runPlugins(
        this.plugins,
        'post',
        input,
        session,
        lastRoutePath,
        response
      )
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

  private async runRedirectAction(
    previousResponse: BotResponse,
    { input, session, lastRoutePath }: BotRequest,
    numOfRedirects: number = 0
  ) {
    if (numOfRedirects > 10) {
      throw new Error('Maximum BotAction recursive calls reached (10)')
    }

    const nextPayload = session._botonic_action?.split(
      `${BotonicAction.Redirect}:`
    )[1]

    const inputWithBotActionPayload: Input = {
      ...input,
      payload: nextPayload,
      type: INPUT.POSTBACK,
      data: undefined,
      text: undefined,
    }

    session._botonic_action = undefined

    const followUp = await this.runInput({
      input: inputWithBotActionPayload,
      session,
      lastRoutePath,
    })

    const response = {
      input: followUp.input,
      response: previousResponse.response.concat(followUp.response),
      session,
      lastRoutePath: followUp.lastRoutePath,
    }

    // Recursive call to handle multiple bot actions in a row
    if (response.session._botonic_action?.startsWith(BotonicAction.Redirect)) {
      return await this.runRedirectAction(
        response,
        {
          input,
          session,
          lastRoutePath,
        },
        numOfRedirects + 1
      )
    }

    if (
      response.session._botonic_action?.startsWith(BotonicAction.CreateTestCase)
    ) {
      return await this.runFollowUpTestIntegrationInput(response, {
        input,
        session,
        lastRoutePath,
      })
    }

    return response
  }
}
