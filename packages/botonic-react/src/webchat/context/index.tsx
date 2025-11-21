import { createContext } from 'react'

import { ChunkIdsGroupedBySourceData } from '../../components/system-debug-trace/events/knowledge-bases-types'
import { MinimalHubtypeMessage } from '../../index-types'
import { WebchatContextProps, WebchatState } from './types'

export { ClientSession, WebchatState } from './types'
export { useWebchat } from './use-webchat'

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
  updateCustomMessageProps: () => {
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
  webchatState: {} as WebchatState,
  previewUtils: {
    trackPreviewEventOpened: () => {
      return
    },
    getChunkIdsGroupedBySource: async () => {
      return [] as ChunkIdsGroupedBySourceData[]
    },
    onClickOpenChunks: () => {
      return
    },
    getMessageById: async () => {
      return {} as MinimalHubtypeMessage
    },
  },

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
