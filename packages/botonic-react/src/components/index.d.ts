import * as React from 'react'
import { ErrorInfo } from 'react'

import { CoverComponentProps } from '../webchat'

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
  children: React.ReactNode
  delay?: number
  from?: 'user' | 'bot'
  json?: Record<string, unknown>
  style?: Record<string, unknown>
  type?: MessageType
  typing?: number
}

export const Audio: React.FunctionComponent<MessageProps>
export const Document: React.FunctionComponent<MessageProps>

export const Message: React.FunctionComponent<MessageProps>
export type Message = React.FunctionComponent<MessageProps>
export const Video: React.FunctionComponent<MessageProps>

export interface TextProps extends MessageProps {
  // converts markdown syntax to HTML
  markdown?: boolean
}
export const Text: React.FunctionComponent<TextProps>

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
}

export const Button: React.FunctionComponent<ButtonProps>

export interface ReplyProps {
  path?: string
  payload?: string
  children: string
}
export const Reply: React.FunctionComponent<ReplyProps>
export type Reply = React.FunctionComponent<ReplyProps>

export interface PicProps {
  src: string
}

export const Carousel: React.FunctionComponent<MessageProps>
export const Image: React.FunctionComponent<ImageProps>
export const Pic: React.FunctionComponent<PicProps>
export type ImageProps = PicProps

export interface TitleProps {
  children: React.ReactNode
  style: string
}

export const Element: React.FunctionComponent<MessageProps>
export const Subtitle: React.FunctionComponent<SubtitleProps>
export const Title: React.FunctionComponent<TitleProps>
export type SubtitleProps = TitleProps

type CustomProp = { custom?: React.ComponentType }
type EnableProp = { enable?: boolean }
type ImageProp = { image?: string } // https URL or imported Image asset
type PersistentMenuCloseOption = { closeLabel: string }
type PersistentMenuOption = { label: string } & ButtonProps
type StyleProp = { style?: any }

export type PersistentMenuTheme = (
  | PersistentMenuCloseOption
  | PersistentMenuOption
)[]

export interface PersistentMenuProps {
  onClick: () => void
  options: any
}

export type BlockInputOption = { match: RegExp[]; message: string }

export interface BlobProps {
  blobTick?: boolean
  blobTickStyle?: any
  blobWidth?: string
  imageStyle?: any
}

export interface ScrollbarProps {
  autoHide?: boolean
  thumb?: {
    bgcolor?: string
    border?: string
    color?: string
    opacity?: string
  }
  track?: {
    bgcolor?: string
    border?: string
    color?: string
  }
}

export interface ThemeProps extends StyleProp {
  mobileBreakpoint?: number
  mobileStyle?: any
  webview?: StyleProp & { header?: StyleProp }
  animations?: EnableProp
  intro?: StyleProp & ImageProp & CustomProp
  brand?: { color?: string } & ImageProp
  header?: { title?: string; subtitle?: string } & ImageProp &
    StyleProp &
    CustomProp
  message?: {
    bot?: BlobProps & ImageProp & StyleProp
    user?: BlobProps & StyleProp
    customTypes?: React.ComponentType[]
  } & StyleProp & {
      timestamps?: {
        enable?: boolean
        format(): string
      } & StyleProp
    }
  button?: {
    autodisable?: boolean
    disabledstyle?: any
    hoverBackground?: string
    hoverTextColor?: string
    messageType?: 'text' | 'payload'
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
  markdownStyle?: string // string template with css styles
  scrollbar?: ScrollbarProps & EnableProp
  userInput?: {
    attachments?: EnableProp
    blockInputs?: BlockInputOption[]
    box?: { placeholder: string } & StyleProp
    emojiPicker?: EnableProp
    menu?: { darkBackground?: boolean } & {
      custom?: React.ComponentType<PersistentMenuProps>
    }
    menuButton?: CustomProp
    persistentMenu?: PersistentMenuTheme
    sendButton?: EnableProp & CustomProp
  } & EnableProp &
    StyleProp
}

export interface CoverComponentOptions {
  component: React.Component<CoverComponentProps>
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
}
export const WebchatSettings: React.FunctionComponent<WebchatSettingsProps>

export type WrappedComponent<Props> = React.FunctionComponent<Props> & {
  customTypeName: string
}

export class ErrorBoundary<Props> extends React.Component<Props> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void
}

export function createErrorBoundary<Props>(_?: {
  errorComponent: React.ComponentType
}): ErrorBoundary<Props>

export function customMessage<Props>(_: {
  name: string
  component: React.ComponentType<Props>
  defaultProps?: Record<string, unknown>
  errorBoundary?: ErrorBoundary<Props>
}): WrappedComponent<Props>

export function getDisplayName(component: React.ComponentType): string

export * from './multichannel'
