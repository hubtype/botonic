import { Input as CoreInput, Session as CoreSession } from '@botonic/core'
import { createContext } from 'react'

import { ActionRequest } from './index-types'

export const RequestContext = createContext<ActionRequest>({
  // TODO: remove getString function?
  getString: () => '',
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

export const WebviewRequestContext = createContext<{
  closeWebview: (options?: CloseWebviewOptions) => Promise<void>
  getString?: (stringId: string) => string
  params: Record<string, any>
  session: Partial<CoreSession>
}>({
  closeWebview: async () => undefined,
  getString: undefined,
  params: {} as Record<string, any>,
  session: {} as Partial<CoreSession>,
})
