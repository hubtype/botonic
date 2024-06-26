import { Inspector } from './debug'
import { getString } from './i18n'
import {
  BotRequest,
  BotResponse,
  INPUT,
  Locales,
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

  async input({ input, session, lastRoutePath }: any): Promise<BotResponse> {
    const output = await this.runInput({ input, session, lastRoutePath })
    if (!session.is_test_integration) {
      return output
    }
    if (!session._botonic_action?.startsWith('create_test_integration_case:')) {
      return output
    }

    const [_, onFinishPayloadId] = session._botonic_action.split(
      'create_test_integration_case:'
    )

    const newInput = {
      ...input,
      payload: onFinishPayloadId,
      type: INPUT.POSTBACK,
      data: undefined,
      text: undefined,
    }

    session._botonic_action = undefined

    const newOutput = (this.router as Router).processInput(
      newInput,
      output.session,
      output.lastRoutePath
    )

    const newRequest = {
      getString: stringId => this.getString(stringId, session),
      setLocale: locale => this.setLocale(locale, session),
      session: session || {},
      params: newOutput.params || {},
      input: newInput,
      plugins: this.plugins,
      defaultTyping: this.defaultTyping,
      defaultDelay: this.defaultDelay,
      lastRoutePath,
    }
    const followUpResponse = await this.renderer({
      request: newRequest,
      actions: [
        newOutput.fallbackAction,
        newOutput.action,
        newOutput.emptyAction,
      ],
    })

    return {
      input: newInput,
      response: output.response.concat(followUpResponse),
      session,
      lastRoutePath: newOutput.lastRoutePath,
    }
  }

  async runInput({ input, session, lastRoutePath }: any): Promise<BotResponse> {
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
    const output = (this.router as Router).processInput(
      input,
      session,
      lastRoutePath
    )

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
    }
    const response = await this.renderer({
      request,
      actions: [output.fallbackAction, output.action, output.emptyAction],
    })

    lastRoutePath = output.lastRoutePath

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

    session.is_first_interaction = false

    return {
      input,
      response,
      session,
      lastRoutePath,
    }
  }
}
