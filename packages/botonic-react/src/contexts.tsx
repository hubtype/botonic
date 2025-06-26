import { Input as CoreInput, Session as CoreSession } from '@botonic/core'
import { createContext } from 'react'

import { ActionRequest } from './index-types'

export const RequestContext = createContext<ActionRequest>({
  getUserCountry: () => '',
  getUserLocale: () => '',
  getSystemLocale: () => '',
  setUserCountry: () => undefined,
  setUserLocale: () => undefined,
  setSystemLocale: () => undefined,
  params: {},
  defaultDelay: 0,
  defaultTyping: 0,
  input: {} as CoreInput,
  session: {} as CoreSession,
  lastRoutePath: '',
  plugins: {},
})

export interface CloseWebviewOptions {
  payload?: string
  path?: string
  params?: Record<string, any>
}

export interface WebviewRequestContextType {
  params: Record<string, string>
  session: Partial<CoreSession>
  getUserCountry: () => string
  getUserLocale: () => string
  getSystemLocale: () => string
  closeWebview: (options?: CloseWebviewOptions) => Promise<void>
}

export const WebviewRequestContext = createContext<WebviewRequestContextType>({
  params: {} as Record<string, string>,
  session: {} as Partial<CoreSession>,
  getUserCountry: () => '',
  getUserLocale: () => '',
  getSystemLocale: () => '',
  closeWebview: async () => undefined,
})
