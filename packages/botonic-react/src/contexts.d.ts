import * as core from '@botonic/core'
import * as React from 'react'

import { ThemeProps, Webview } from './components'
import { ActionRequest, WebchatMessage, WebchatState } from './index'

export interface RequestContextInterface extends ActionRequest {
  getString: (stringId: string) => string
  setLocale: (locale: string) => string
}

export const RequestContext: React.Context<RequestContextInterface>
export type RequestContext = React.Context<RequestContextInterface>

export const WebchatContext: React.Context<{
  sendText: (text: string) => string
  sendAttachment: (attachment: File) => string
  sendPayload: (payload: string) => string
  sendInput: (input: core.Input) => string
  openWebview: (webviewComponent: Webview) => string
  addMessage: (message: WebchatMessage) => string
  updateMessage: (message: WebchatMessage) => string
  updateReplies: (replies: boolean) => string
  updateLatestInput: (input: core.Input) => string
  closeWebview: () => string
  toggleWebchat: () => string
  getThemeProperty: (
    property: string,
    defaultValue?: string
  ) => string | undefined
  resolveCase: () => string
  theme: ThemeProps
  webchatState: WebchatState
  updateWebchatDevSettings: (settings: WebchatDevSettings) => void
  updateUser: (user: core.SessionUser) => string
}>
