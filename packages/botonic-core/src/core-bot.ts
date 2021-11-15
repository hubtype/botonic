import { Inspector } from './debug'
import { getString } from './i18n'
import {
  BotonicEvent,
  BotRequest,
  BotResponse,
  BotState,
  Locales,
  Route,
  Routes,
  Session,
} from './models'
import { BotonicOutputParser } from './output-parser'
import { loadPlugins, runPlugins } from './plugins'
import { getComputedRoutes, Router } from './routing'

interface CoreBotConfig {
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
  plugins?: Record<string, Plugin>
  renderer: any
  rootElement: any
  router: Router | null
  routes: Routes
  theme?: any
  botonicOutputParser = new BotonicOutputParser()

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
    this.router =
      this.routes instanceof Function
        ? null
        : new Router(
            [...this.routes, ...this.defaultRoutes],
            this.inspector.routeInspector
          )
  }

  getString(id: string, botState: BotState): string {
    if (!botState.locale) {
      console.error('Locale is not defined')
      return ''
    }
    return getString(this.locales, botState.locale, id)
  }

  setLocale(locale: string, botState: BotState): void {
    botState.locale = locale
  }

  async input({
    input,
    session,
    botState,
    dataProvider,
  }: BotRequest): Promise<BotResponse> {
    if (!botState.locale) botState.locale = 'en'

    if (this.plugins) {
      await runPlugins(
        this.plugins,
        'pre',
        input,
        session,
        botState,
        undefined,
        undefined,
        dataProvider
      )
    }

    if (this.routes instanceof Function) {
      this.router = new Router(
        [
          ...(await getComputedRoutes(this.routes, {
            input,
            session,
            botState,
          })),
          ...this.defaultRoutes,
        ],
        this.inspector.routeInspector
      )
    }

    const output = (this.router as Router).processInput(
      input,
      session,
      botState
    )

    const request = {
      getString: stringId => this.getString(stringId, botState),
      setLocale: locale => this.setLocale(locale, botState),
      session: session || {},
      params: output.params || {},
      input: input,
      plugins: this.plugins,
      defaultTyping: this.defaultTyping,
      defaultDelay: this.defaultDelay,
      botState,
      dataProvider,
    }

    const response = await this.renderer({
      request,
      actions: [output.fallbackAction, output.action, output.emptyAction],
    })

    const messageEvents: Partial<BotonicEvent>[] = this.botonicOutputParser.xmlToMessageEvents(
      response
    )

    botState.lastRoutePath = output.botState.lastRoutePath // not needed if updated below

    if (this.plugins) {
      await runPlugins(
        this.plugins,
        'post',
        input,
        session, // passing output.session instead
        botState, // passing output.botState instead
        response,
        messageEvents,
        dataProvider
      )
    }

    botState.isFirstInteraction = false

    return {
      input, // Delete
      response, // xml/rendered react for actions (not needed)
      messageEvents, // xml to Botonic Events
      session, // to be output.session
      botState, // to be output.botState
      dataProvider, // no need to return it
    }
  }
}
