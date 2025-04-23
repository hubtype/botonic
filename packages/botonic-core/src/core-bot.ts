import { Inspector } from './debug'
import { getString } from './i18n'
import {
  BotContext,
  BotonicAction,
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
import { runPlugins } from './plugins'
import { getComputedRoutes, Router } from './routing'

export interface CoreBotConfig {
  appId?: string
  defaultDelay?: number
  defaultRoutes?: Route[]
  defaultTyping?: number
  inspector?: Inspector
  locales: Locales
  plugins?: ResolvedPlugins
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
  renderer: any // TODO use a type like ({ request, actions }: RendererArgs) => Promise<any[]>
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
    this.plugins = plugins || {}
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

  // TODO: remove getString function?
  getString(id: string, session: Session): string {
    return getString(this.locales, session.user.system_locale, id)
  }

  setSystemLocale(locale: string, session: Session): void {
    session.user.system_locale = locale
  }

  setUserLocale(locale: string, session: Session): void {
    session.user.locale = locale
  }

  setUserCountry(country: string, session: Session): void {
    session.user.country = country
  }

  async input(request: BotRequest): Promise<BotResponse> {
    const botContext = this.getBotContext(request)

    const output = await this.runInput(botContext)

    if (
      botContext.session._botonic_action?.startsWith(BotonicAction.Redirect)
    ) {
      return await this.runRedirectAction(output, botContext)
    }

    return output
  }

  private getBotContext(request: BotRequest): BotContext {
    const { input, session, lastRoutePath } = request
    return {
      input,
      session,
      lastRoutePath,
      params: {},
      plugins: this.plugins,
      defaultTyping: this.defaultTyping,
      defaultDelay: this.defaultDelay,
      // TODO: remove getString function?
      getString: (stringId: string) => this.getString(stringId, session),
      getUserCountry: () => session.user.country,
      getUserLocale: () => session.user.locale,
      getSystemLocale: () => session.user.system_locale,
      setUserCountry: (country: string) =>
        this.setUserCountry(country, session),
      setUserLocale: (locale: string) => this.setUserLocale(locale, session),
      setSystemLocale: (locale: string) =>
        this.setSystemLocale(locale, session),
    }
  }

  private async runInput(botContext: BotContext): Promise<BotResponse> {
    // After first updateSession, user country locale and system_locale are always defined
    this.updateSession(botContext.session)

    if (botContext.input.type === INPUT.CHAT_EVENT) {
      return {
        input: botContext.input,
        session: botContext.session,
        lastRoutePath: botContext.lastRoutePath,
        response: [],
      }
    }

    await this.runPrePlugins(botContext)

    const output = await this.getOutput(botContext)
    botContext = this.updateRequestFromOutput(botContext, output)
    const response = await this.renderer({
      request: botContext,
      actions: [output.fallbackAction, output.action, output.emptyAction],
    })

    await this.runPostPlugins(botContext, response)

    botContext.session.is_first_interaction = false

    return {
      input: botContext.input,
      response,
      session: botContext.session,
      lastRoutePath: botContext.lastRoutePath,
    }
  }

  private updateSession(session: Session) {
    // set new user fields (country, locale, system_locale) from old fields in extra_data
    if (!session.user.country) {
      const country = session.user.extra_data?.country
      this.setUserCountry(country, session)
    }

    if (!session.user.locale) {
      const language = session.user.extra_data?.language
      this.setUserLocale(language, session)
    }

    if (!session.user.system_locale) {
      const locale = session.user.locale
      if (locale) {
        this.setSystemLocale(locale, session)
      }
    }
  }

  private async runPrePlugins(botContext: BotContext) {
    if (this.plugins) {
      await runPlugins({ botContext, mode: 'pre' })
    }
  }

  private async getOutput(botContext: BotContext): Promise<ProcessInputResult> {
    await this.setRouter(botContext)

    const output = (this.router as Router).processInput(
      botContext.input,
      botContext.session,
      botContext.lastRoutePath
    )
    return output
  }

  private async setRouter(botContext: BotContext) {
    if (this.routes instanceof Function) {
      this.router = new Router(
        [
          ...(await getComputedRoutes(this.routes, botContext)),
          ...this.defaultRoutes,
        ],
        this.inspector.routeInspector
      )
    }
  }

  private updateRequestFromOutput(
    botContext: BotContext,
    output: ProcessInputResult
  ): BotContext {
    return {
      ...botContext,
      params: output.params || {},
      lastRoutePath: output.lastRoutePath,
    }
  }

  private async runPostPlugins(botContext: BotContext, response: any) {
    if (this.plugins) {
      await runPlugins({
        botContext,
        mode: 'post',
        response,
      })
    }
  }

  private async runRedirectAction(
    previousResponse: BotResponse,
    botContext: BotContext,
    numOfRedirects: number = 0
  ) {
    if (numOfRedirects > 10) {
      throw new Error('Maximum BotAction recursive calls reached (10)')
    }

    const nextPayload = botContext.session._botonic_action?.split(
      `${BotonicAction.Redirect}:`
    )[1]

    const inputWithBotActionPayload: Input = {
      ...botContext.input,
      payload: nextPayload,
      type: INPUT.POSTBACK,
      data: undefined,
      text: undefined,
    }

    botContext.session._botonic_action = undefined
    botContext.input = inputWithBotActionPayload

    const followUp = await this.runInput(botContext)

    const response = {
      input: followUp.input,
      response: previousResponse.response.concat(followUp.response),
      session: botContext.session,
      lastRoutePath: followUp.lastRoutePath,
    }

    // Recursive call to handle multiple bot actions in a row
    if (response.session._botonic_action?.startsWith(BotonicAction.Redirect)) {
      return await this.runRedirectAction(
        response,
        botContext,
        numOfRedirects + 1
      )
    }

    return response
  }
}
