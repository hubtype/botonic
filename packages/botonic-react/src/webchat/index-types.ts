import type { Input as CoreInput, Session as CoreSession } from '@botonic/core'

import { Reply } from '../components'
import { Webview } from '../components/index-types'
import { WebchatArgs } from '../index-types'

export interface WebchatStateTheme {
  headerTitle: string
  brandColor: string
  brandImage: string
  triggerButtonImage: undefined
  textPlaceholder: string
  style: {
    fontFamily: string
    borderRadius?: string
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
  replies?: (typeof Reply)[]
  latestInput: Partial<CoreInput>
  typing: boolean
  webview: Webview | null
  webviewParams: null
  session: Partial<CoreSession>
  lastRoutePath?: string
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
  numUnreadMessages: number
  isLastMessageVisible: boolean
  isInputFocused: boolean
}

export interface WebchatDevProps extends WebchatArgs {
  initialDevSettings?: {
    keepSessionOnReload?: boolean
    showSessionView?: boolean
  }
}

export interface CoverComponentProps {
  closeComponent: () => void
}
