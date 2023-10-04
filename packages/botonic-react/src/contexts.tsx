import { createContext } from 'react'

import { WebchatContextProps } from './index-types'
import { webchatInitialState } from './webchat/hooks'

export const RequestContext = createContext({
  getString: () => '',
  setLocale: () => '',
  session: {},
  params: {},
  input: {},
  defaultDelay: 0,
  defaultTyping: 0,
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
