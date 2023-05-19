import { createContext } from 'react'

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

export const WebchatContext = createContext({
  sendText: text => {},
  sendAttachment: attachment => {},
  sendPayload: payload => {},
  sendInput: input => {},
  setReplies: replies => {},
  openWebview: webviewComponent => {},
  addMessage: message => {},
  updateMessage: message => {},
  updateReplies: replies => {},
  updateLatestInput: input => {},
  closeWebview: () => {},
  toggleWebchat: () => {},
  getThemeProperty: property => undefined, // used to retrieve a specific property of the theme defined by the developer in his 'webchat/index.js'
  resolveCase: () => {},
  theme: {},
  webchatState: webchatInitialState,
  updateWebchatDevSettings: settings => {
    return {}
  },
  updateUser: user => {},
})
