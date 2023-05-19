import type {
  Input as CoreInput,
  Session as CoreSession,
} from '@botonic/core/lib/esm/models/legacy-types'
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
  error: { message?: string }
  devSettings: { keepSessionOnReload?: boolean; showSessionView?: boolean }
  isWebchatOpen: boolean
  isEmojiPickerOpen: boolean
  isPersistentMenuOpen: boolean
  isCoverComponentOpen: boolean
  lastMessageUpdate: string
  currentAttachment: File | undefined
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
