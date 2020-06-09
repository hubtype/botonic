import React from 'react'
import { webchatInitialState } from './webchat/hooks'

export const RequestContext = React.createContext({
  getString: () => '',
  setLocale: () => '',
  session: {},
  params: {},
  input: {},
  defaultDelay: 0,
  defaultTyping: 0,
})

export const WebchatContext = React.createContext({
  sendText: text => '',
  sendAttachment: attachment => '',
  sendPayload: payload => '',
  setReplies: replies => '',
  openWebview: webviewComponent => '',
  addMessage: message => '',
  updateReplies: replies => '',
  closeWebview: () => '',
  getThemeProperty: property => undefined, // used to retrieve a specific property of the theme defined by the developer in his 'webchat/index.js'
  theme: {},
  webchatState: webchatInitialState,
  updateWebchatDevSettings: settings => {
    return {}
  },
})
