import { createContext } from 'react'

import { WebchatContextProps } from './types'
import { webchatInitialState } from './use-webchat'

export { WebchatState } from './types'
export { useWebchat, webchatInitialState } from './use-webchat'

export const WebchatContext = createContext<WebchatContextProps>({
  addMessage: () => {
    return
  },
  getThemeProperty: () => {
    return
  }, // used to retrieve a specific property of the theme defined by the developer in his 'webchat/index.js'
  closeWebview: async () => {
    return
  },
  openWebview: () => {
    return
  },
  resolveCase: () => {
    return
  },
  resetUnreadMessages: () => {
    return
  },
  setIsInputFocused: () => {
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
  theme: {}, // TODO: Remove this attribute and use allways webchatState.theme
  toggleCoverComponent: () => {
    return
  },
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
  webchatContainerRef: { current: null },
  chatAreaRef: { current: null },
  inputPanelRef: { current: null },
  headerRef: { current: null },
  scrollableMessagesListRef: { current: null },
  repliesRef: { current: null },
})
