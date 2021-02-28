/* eslint-disable node/no-missing-import */
import {
  BotRequest,
  BotResponse,
  Locales,
  PluginConfig,
  Routes,
  Session,
} from '.'
import { Inspector } from './debug'
import { Router } from './router'

export interface BotOptions {
  /** The plugin configurations */
  appId?: string
  defaultDelay?: number
  defaultRoutes?: Routes
  defaultTyping?: number
  inspector?: Inspector
  locales: Locales
  plugins?: PluginConfig<any>
  renderer: any
  routes: Routes
  theme?: any
}

export declare class CoreBot {
  constructor(options: BotOptions)

  appId?: string
  defaultDelay?: number
  defaultRoutes?: Routes
  defaultTyping?: number
  inspector?: Inspector
  locales: Locales
  plugins?: PluginConfig<any>
  renderer: any
  rootElement: any
  router: Router
  routes: Routes
  theme?: any

  getString(stringID: string, session: Session): string
  setLocale(locale: string, session: Session): void
  input(request: BotRequest): Promise<BotResponse>
}
