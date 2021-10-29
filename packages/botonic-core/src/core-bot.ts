import { ulid } from 'ulid'

import { Inspector } from './debug'
import { getString } from './i18n'
import {
  BotonicEvent,
  BotRequest,
  BotResponse,
  BotState,
  Locales,
  MessageEventAck,
  MessageEventFrom,
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
    // @ts-ignore
    const userId = input.userId

    const parsedUserEvent = this.botonicOutputParser.inputToBotonicEvent(input)

    if (dataProvider) {
      // TODO: Next iterations. Review cycle of commited events to DB when messages change their ACK
      // @ts-ignore
      const userEvent = await dataProvider.saveEvent({
        ...parsedUserEvent,
        userId,
        eventId: ulid(),
        createdAt: new Date().toISOString(),
        from: MessageEventFrom.USER,
        ack: MessageEventAck.RECEIVED,
      })
    }

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
    let messageEvents: Partial<BotonicEvent>[] = []
    try {
      messageEvents = this.botonicOutputParser.xmlToMessageEvents(response)
    } catch (e) {
      // Disabling Botonic 1.0 error log for LTS version:
      // console.error(e)
    }

    botState.lastRoutePath = output.botState.lastRoutePath

    if (this.plugins) {
      await runPlugins(
        this.plugins,
        'post',
        input,
        session,
        botState,
        response,
        messageEvents,
        dataProvider
      )
    }

    if (dataProvider) {
      // TODO: save bot responses to db and update user with new session and new params
      for (const messageEvent of messageEvents) {
        // @ts-ignore
        const botEvent = await dataProvider.saveEvent({
          ...messageEvent,
          userId,
          eventId: ulid(),
          createdAt: new Date().toISOString(),
          from: MessageEventFrom.BOT,
          ack: MessageEventAck.SENT,
        })
      }
    }

    botState.isFirstInteraction = false

    if (dataProvider) {
      const user = await dataProvider.getUser(userId)
      if (!user) {
        // throw error
      } else {
        const updatedUser = { ...user, session, botState }
        // @ts-ignore
        await dataProvider.updateUser(updatedUser)
      }
    }
    // TODO: return also updatedUser?
    return {
      input,
      response,
      messageEvents,
      session,
      botState,
      dataProvider,
    }
  }
}
