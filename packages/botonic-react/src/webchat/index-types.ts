import type { Input as CoreInput, Session as CoreSession } from '@botonic/core'
import { RefObject } from 'react'

import { Webview } from '../components/index-types'

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

export interface ErrorMessage {
  message?: string
}
export interface DevSettings {
  keepSessionOnReload?: boolean
  showSessionView?: boolean
}

export interface WebchatState {
  width: number
  height: number
  messagesJSON: any[]
  messagesComponents: any[]
  replies: any[]
  latestInput: Partial<CoreInput>
  typing: boolean
  webview: Webview | null
  webviewParams: null
  session: Partial<CoreSession>
  lastRoutePath: string | null
  handoff: boolean
  theme: WebchatStateTheme
  themeUpdates: Partial<WebchatStateTheme>
  error: ErrorMessage
  online: boolean
  devSettings: DevSettings
  isWebchatOpen: boolean
  isEmojiPickerOpen: boolean
  isPersistentMenuOpen: boolean
  isCoverComponentOpen: boolean
  isCustomComponentRendered: boolean
  lastMessageUpdate?: string
  currentAttachment?: File
  jwt?: string
  numUnreadMessages: number
  isLastMessageVisible: boolean
}

// export interface WebchatProps extends WebchatArgs {
export interface WebchatProps {
  ref: RefObject<any>
  onConnectionRegained?: () => Promise<void>
}

export interface WebchatDevProps extends WebchatProps {
  initialDevSettings?: {
    keepSessionOnReload?: boolean
    showSessionView?: boolean
  }
}

export interface CoverComponentProps {
  closeComponent: () => void
}
