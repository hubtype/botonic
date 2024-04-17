import { Input as CoreInput, Session as CoreSession } from '@botonic/core'
import { createContext } from 'react'

import { ActionRequest, WebchatContextProps } from './index-types'
import { webchatInitialState } from './webchat/hooks'

export const RequestContext = createContext<
  Partial<ActionRequest> & {
    getString: () => string
    setLocale: () => void
  }
>({
  getString: () => '',
  setLocale: () => undefined,
  session: {} as CoreSession,
  params: {},
  input: {} as CoreInput,
  defaultDelay: 0,
  defaultTyping: 0,
})

export interface CloseWebviewOptions {
  payload?: string
  path?: string
  params?: Record<string, any>
}

export const WebviewRequestContext = createContext<{
  closeWebview: (options?: CloseWebviewOptions) => undefined
  getString: (stringId: string) => string
  params: Record<string, any>
  session: CoreSession
}>({
  closeWebview: () => undefined,
  getString: () => '',
  params: {} as Record<string, any>,
  session: {} as CoreSession,
})

export const WebchatContext = createContext<WebchatContextProps>({
  addMessage: () => {
    return
  },
  closeWebview: () => {
    return
  },
  getThemeProperty: () => {
    return
  }, // used to retrieve a specific property of the theme defined by the developer in his 'webchat/index.js'
  openWebview: () => {
    return
  },
  resolveCase: () => {
    return
  },
  resetUnreadMessages: () => {
    return
  },
  setLastMessageVisible: () => {
    return
  },
  sendAttachment: () => {
    return
  },
  sendInput: () => {
    return
  },
  sendPayload: () => {
    return
  },
  sendText: () => {
    return
  },
  theme: {},
  toggleWebchat: () => {
    return
  },
  updateLatestInput: () => {
    return
  },
  updateMessage: () => {
    return
  },
  updateReplies: () => {
    return
  },
  updateUser: () => {
    return
  },
  updateWebchatDevSettings: () => {
    return
  },
  webchatState: webchatInitialState,
})
