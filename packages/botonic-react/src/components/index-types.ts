import React from 'react'

import { SENDERS } from '../index-types'
import { CoverComponentProps } from '../webchat/index-types'

export type MessageType =
  | 'audio'
  | 'buttonmessage'
  | 'carousel'
  | 'custom'
  | 'document'
  | 'image'
  | 'location'
  | 'text'
  | 'video'

export interface MessageProps {
  blob?: boolean
  children?: React.ReactNode
  delay?: number
  enabletimestamps?: boolean
  sentBy?: SENDERS
  json?: Record<string, unknown>
  style?: Record<string, unknown>
  type?: MessageType
  typing?: number
}

export interface TextProps extends MessageProps {
  // converts markdown syntax to HTML
  markdown?: boolean
  feedbackEnabled?: boolean
  inferenceId?: string
  botInteractionId?: string
}

export interface Webview {
  name: string
}

export interface ButtonProps {
  params?: any
  path?: string
  payload?: string
  target?: string
  url?: string
  webview?: Webview
  onClick?: () => void
  autodisable?: boolean
  disabled?: boolean
  disabledstyle?: boolean
  children: string
  setDisabled?: (disabled: boolean) => void
  parentId?: string
}

export interface ReplyProps {
  path?: string
  payload?: string
  children: string
}

export interface PicProps {
  src: string
}

export interface ImageProps extends MessageProps {
  src: string
  input?: { data: string }
}

export interface VideoProps extends MessageProps {
  src: string
  input?: { data: string }
}

export interface AudioProps extends MessageProps {
  src: string
  input?: { data: string }
}

export interface DocumentProps extends MessageProps {
  src: string
  input?: { data: string }
  from?: any
}

export interface TitleProps {
  children: React.ReactNode
  style: string
}

export type SubtitleProps = TitleProps

export type CustomProp = { custom?: React.ComponentType }
export type EnableProp = { enable?: boolean }
export type ImageProp = { image?: string } // https URL or imported Image asset
export type PersistentMenuCloseOption = { closeLabel: string }
export type PersistentMenuOption = { label: string } & ButtonProps
export type StyleProp = { style?: any }

export type PersistentMenuTheme = (
  | PersistentMenuCloseOption
  | PersistentMenuOption
)[]

export interface PersistentMenuProps {
  onClick: () => void
  options: any
}

export type BlockInputOption = {
  preprocess?: (message: string) => string
  match: RegExp[]
  message: string
}

export interface BlobProps {
  blobTick?: boolean
  blobTickStyle?: any
  blobWidth?: string
  imageStyle?: any
}

export interface CustomMessageType {
  (props: any): JSX.Element
  customTypeName: string
  deserialize(msg: any): JSX.Element
}

export interface ThemeProps extends StyleProp {
  coverComponent?: CoverComponentOptions
  mobileBreakpoint?: number
  mobileStyle?: any
  webview?: StyleProp & { header?: StyleProp }
  animations?: EnableProp
  intro?: StyleProp & ImageProp & CustomProp
  brand?: { color?: string } & ImageProp
  header?: { title?: string; subtitle?: string } & ImageProp &
    StyleProp &
    CustomProp
  // TODO: Review if this is needed hear, or only in message.customTypes? use the same type in both places
  customMessageTypes?: CustomMessageType[]
  message?: {
    bot?: BlobProps & ImageProp & StyleProp
    agent?: ImageProp
    user?: BlobProps & StyleProp
    // TODO: Review type used in cutomTypes should be a component exported by default with customMessage function
    customTypes?: CustomMessageType[]
  } & StyleProp & {
      timestamps?: {
        withImage?: boolean
        format: () => string
      } & StyleProp &
        EnableProp
    }
  button?: {
    autodisable?: boolean
    disabledstyle?: any
    hoverBackground?: string
    hoverTextColor?: string
    messageType?: 'text' | 'payload'
    urlIcon?: ImageProp & EnableProp
  } & StyleProp &
    CustomProp
  replies?: {
    align?: 'left' | 'center' | 'right'
    wrap?: 'wrap' | 'nowrap'
  }
  carousel?: {
    arrow?: {
      left: CustomProp
      right: CustomProp
    }
    enableArrows?: boolean
  }
  reply?: StyleProp & CustomProp
  triggerButton?: ImageProp & StyleProp & CustomProp
  notifications?: EnableProp & {
    banner?: CustomProp & EnableProp & { text?: string }
    triggerButton?: EnableProp
  }
  scrollButton?: EnableProp & CustomProp
  markdownStyle?: string // string template with css styles
  userInput?: {
    attachments?: EnableProp & CustomProp
    blockInputs?: BlockInputOption[]
    box?: { placeholder: string } & StyleProp
    emojiPicker?: EnableProp & CustomProp
    menu?: { darkBackground?: boolean } & {
      custom?: React.ComponentType<PersistentMenuProps>
    }
    menuButton?: CustomProp
    persistentMenu?: PersistentMenuTheme
    sendButton?: EnableProp & CustomProp
  } & EnableProp &
    StyleProp
  imagePreviewer?: React.ComponentType<ImagePreviewerProps>
}

interface ImagePreviewerProps {
  src: string
  isPreviewerOpened: boolean
  closePreviewer: () => void
}

export interface CoverComponentOptions {
  component: React.ComponentType<CoverComponentProps>
  props?: any
}

export interface WebchatSettingsProps {
  blockInputs?: BlockInputOption[]
  enableAnimations?: boolean
  enableAttachments?: boolean
  enableEmojiPicker?: boolean
  enableUserInput?: boolean
  persistentMenu?: PersistentMenuTheme
  theme?: ThemeProps
  user?: { extra_data?: any }
}

export type WrappedComponent<Props> = React.FunctionComponent<Props> & {
  customTypeName: string
}
