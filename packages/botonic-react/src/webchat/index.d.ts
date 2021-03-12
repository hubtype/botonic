import * as core from '@botonic/core'
import * as React from 'react'
import { RefObject } from 'react'

import { Reply, Webview } from '../components/index'
import { Message, WebchatApp, WebchatArgs } from '../index'

export interface WebchatStateTheme {
  headerTitle: string
  brandColor: string
  brandImage: string
  triggerButtonImage: undefined
  textPlaceholder: string
  style: {
    fontFamily: string
  }
}

export interface WebchatState {
  width: number
  height: number
  messagesJSON: any[]
  messagesComponents: Message[]
  replies: Reply[]
  latestInput: Partial<core.Input>
  typing: boolean
  webview: Webview | null
  webviewParams: null
  session: Partial<core.Session>
  lastRoutePath: string | null
  handoff: boolean
  theme: WebchatStateTheme
  themeUpdates: Partial<WebchatStateTheme>
  error: { message?: string }
  devSettings: { keepSessionOnReload?: boolean; showSessionView?: boolean }
  isWebchatOpen: boolean
  isEmojiPickerOpen: boolean
  isPersistentMenuOpen: boolean
  isCoverComponentOpen: boolean
  lastMessageUpdate: undefined
  currentAttachment: File | undefined
}

export interface WebchatProps extends WebchatArgs {
  ref: RefObject<any>
  onConnectionRegained?: () => Promise<void>
}
export const WebChat: React.ForwardRefExoticComponent<WebchatProps>

export interface WebchatDevProps extends WebchatProps {
  initialDevSettings?: {
    keepSessionOnReload?: boolean
    showSessionView?: boolean
  }
}
export const WebChatDev: React.ForwardRefExoticComponent<WebchatDevProps>

export function getBotonicApp(): WebchatApp

export interface CoverComponentProps {
  closeComponent: () => void
}
