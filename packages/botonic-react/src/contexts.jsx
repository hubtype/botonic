import React from 'react'
import { webchatInitialState } from './webchat/hooks'

export const RequestContext = React.createContext({
  getString: () => '',
  setLocale: () => '',
  session: {},
  params: {},
  input: {},
  defaultDelay: 0,
  defaultTyping: 0
})

export const WebchatContext = React.createContext({
  sendText: text => '',
  sendPayload: payload => '',
  setReplies: replies => '',
  openWebview: webviewComponent => '',
  addMessage: message => '',
  updateReplies: replies => '',
  closeWebview: () => '',
  theme: {},
  webchatState: webchatInitialState
})
