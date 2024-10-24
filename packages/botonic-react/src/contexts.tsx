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
  closeWebview: (options?: CloseWebviewOptions) => Promise<void>
  getString: (stringId: string) => string
  params: Record<string, any>
  session: CoreSession
}>({
  closeWebview: async () => undefined,
  getString: () => '',
  params: {} as Record<string, any>,
  session: {} as CoreSession,
})

export const WebchatContext = createContext<WebchatContextProps>({
  addMessage: () => {
    return
  },
  closeWebview: async () => {
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
  sendAttachment: async () => {
    return
  },
  sendInput: async () => {
    return
  },
  sendPayload: async () => {
    return
  },
  sendText: async () => {
    return
  },
  theme: {},
  toggleWebchat: () => {
    return
  },
  toggleEmojiPicker: () => {
    return
  },
  togglePersistentMenu: () => {
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
  trackEvent: async () => {
    return
  },
  webchatRef: { current: null },
  chatAreaRef: { current: null },
  inputPanelRef: { current: null },
  headerRef: { current: null },
  scrollableMessagesListRef: { current: null },
  repliesRef: { current: null },
})
