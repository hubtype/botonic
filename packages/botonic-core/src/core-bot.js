import { Inspector } from './debug/inspector'
import { getString } from './i18n'
import { loadPlugins, runPlugins } from './plugins'
import { Router } from './router'
import { isFunction } from './utils'

export class CoreBot {
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
  }) {
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
          [...this.routes, ...this.defaultRoutes],
          this.inspector.routeInspector
        )
  }

  getString(stringID, session) {
    return getString(this.locales, session.__locale, stringID)
  }

  setLocale(locale, session) {
    session.__locale = locale
  }

  async input({ input, session, lastRoutePath }) {
    session = session || {}
    if (!session.__locale) session.__locale = 'en'

    if (this.plugins) {
      await runPlugins(this.plugins, 'pre', input, session, lastRoutePath)
    }

    if (isFunction(this.routes)) {
      this.router = new Router(
        [
          ...(await this.routes({ input, session, lastRoutePath })),
          ...this.defaultRoutes,
        ],
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
    }

    const actions = [output.action, output.retryAction, output.defaultAction]

    const response = await this.renderer({ request, actions })

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
    return { input, response, session, lastRoutePath }
  }
}
