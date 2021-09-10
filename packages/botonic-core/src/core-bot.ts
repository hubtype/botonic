import { Inspector } from './debug'
import { getString } from './i18n'
import {
  BotonicEvent,
  BotRequest,
  BotResponse,
  Locales,
  Routes,
  Session,
} from './models'
import { BotonicOutputParser } from './output-parser'
import { loadPlugins, runPlugins } from './plugins'
import { Router } from './router'
import { isFunction } from './utils'

interface CoreBotConfig {
  appId?: string
  defaultDelay?: number
  defaultRoutes?: Routes
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
  defaultRoutes?: Routes
  defaultTyping?: number
  inspector?: Inspector
  locales: Locales
  plugins?: Record<string, Plugin>
  renderer: any
  rootElement: any
  router: any
  routes: Routes
  theme?: any

  constructor({
    // TODO: Receives dataProvider
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
    if (appId) {
      this.appId = appId
      return
    }
    this.rootElement = null
    this.inspector = inspector || new Inspector()
    this.routes = routes
    this.defaultRoutes = defaultRoutes || []
    this.router = isFunction(this.routes)
      ? null
      : new Router(
          // @ts-ignore
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
    session = session || {}
    if (!session.__locale) session.__locale = 'en'

    // TODO: save new userEvent

    if (this.plugins) {
      // pass dataProvider
      await runPlugins(this.plugins, 'pre', input, session, lastRoutePath)
    }

    if (isFunction(this.routes)) {
      this.router = new Router(
        [
          // @ts-ignore
          ...(await this.routes({ input, session, lastRoutePath })),
          // @ts-ignore
          ...this.defaultRoutes,
        ],
        // @ts-ignore
        this.inspector.routeInspector
      )
    }

    const output = this.router.processInput(input, session, lastRoutePath)

    const request = {
      getString: stringId => this.getString(stringId, session),
      setLocale: locale => this.setLocale(locale, session),
      session: session || {},
      params: output.params || {},
      input: input,
      plugins: this.plugins,
      defaultTyping: this.defaultTyping,
      defaultDelay: this.defaultDelay,
      lastRoutePath,
      // dataProvider
    }

    const actions = [output.action, output.retryAction, output.defaultAction]

    const response = await this.renderer({ request, actions })
    let parsedResponse: Partial<BotonicEvent>[] | null = null
    try {
      parsedResponse = new BotonicOutputParser().xmlToMessageEvents(response)
    } catch (e) {}

    lastRoutePath = output.lastRoutePath
    if (this.plugins) {
      await runPlugins(
        this.plugins,
        'post',
        input,
        session,
        lastRoutePath,
        response,
        parsedResponse
      )
    }

    // TODO: save bot responses to db and update user with new session and new params

    session.is_first_interaction = false
    return { input, response, parsedResponse, session, lastRoutePath }
  }
}
