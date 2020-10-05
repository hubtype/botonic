import * as React from 'react'

export type MessageType =
  | 'text'
  | 'carousel'
  | 'audio'
  | 'video'
  | 'location'
  | 'document'
  | 'buttonmessage'
  | 'custom'
  | 'image'

export interface MessageProps {
  children: React.ReactNode
  type?: MessageType
  blob?: boolean
  from?: 'user' | 'bot'
  delay?: number
  typing?: number
  /** Used to persist the state on the browser localstorage */
  json?: Record<string, unknown>
  style?: Record<string, unknown>
}

export const Message: React.FunctionComponent<MessageProps>

export const Audio: React.FunctionComponent<MessageProps>
export const Document: React.FunctionComponent<MessageProps>
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
  payload?: string
  url?: string
  target?: string
  path?: string
  webview?: Webview
  params?: any
}

export const Button: React.FunctionComponent<ButtonProps>

export type ReplyProps = ButtonProps
export const Reply: React.FunctionComponent<ReplyProps>

export interface PicProps {
  src: string
}
export const Pic: React.FunctionComponent<PicProps>

export type ImageProps = PicProps
export const Image: React.FunctionComponent<ImageProps>

export const Carousel: React.FunctionComponent<MessageProps>

export interface TitleProps {
  style: string
  children: React.ReactNode
}

export const Title: React.FunctionComponent<TitleProps>

export type SubtitleProps = TitleProps
export const Subtitle: React.FunctionComponent<SubtitleProps>

export const Element: React.FunctionComponent<MessageProps>

type StyleProp = { style?: any }
type ImageProp = { image?: string } // https URL or imported Image asset
type EnableProp = { enable?: boolean }
type CustomProp = { custom?: React.Component }
type PersistentMenuOption = { label: string } & ButtonProps
type PersistentMenuCloseOption = { closeLabel: string }

export type PersistentMenuProps =
  | PersistentMenuOption[]
  | PersistentMenuCloseOption[]

export type BlockInputOption = { message: string; match: RegExp[] }

export interface BlobProps {
  blobWidth?: string
  imageStyle?: any
  blobTick?: boolean
  blobTickStyle?: any
}

export interface ScrollbarProps {
  thumb?: {
    color: string
    bgcolor: string
    border: string
    opacity: string
  }
  track?: {
    color: string
    bgcolor: string
    border: string
  }
}

export interface ThemeProps {
  mobileBreakpoint: number
  mobileStyle: StyleProp
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
    customTypes?: React.Component[]
  } & StyleProp & {
      timestamps?: {
        enable: boolean
        format(): string
      } & StyleProp
    }
  button?: {
    messageType?: 'text' | 'payload'
    hoverBackground: string
    hoverTextColor: string
  } & StyleProp &
    CustomProp
  replies?: {
    wrap?: 'wrap' | 'nowrap'
    align?: 'left' | 'center' | 'right'
  }
  carousel?: {
    enableArrows?: boolean
    arrow?: {
      left: CustomProp
      right: CustomProp
    }
  }
  reply?: StyleProp & CustomProp
  triggerButton?: ImageProp & StyleProp & CustomProp
  markdownStyle?: string // string template with css styles
  scrollbar?: ScrollbarProps & EnableProp
  userInput?: {
    box?: { placeholder: string } & StyleProp
    emojiPicker?: EnableProp
    attachments?: EnableProp
    sendButton?: EnableProp & CustomProp
    persistentMenu?: PersistentMenuProps
    blockInputs?: BlockInputOption[]
    menu?: { darkBackground?: boolean } & CustomProp
    menuButton?: CustomProp
  } & EnableProp &
    StyleProp
}

export interface WebchatSettingsProps {
  theme?: ThemeProps
  persistentMenu?: PersistentMenuProps
  blockInputs?: BlockInputOption[]
  enableUserInput?: boolean
  enableEmojiPicker?: boolean
  enableAttachments?: boolean
  enableAnimations?: boolean
}

export const WebchatSettings: React.FunctionComponent<WebchatSettingsProps>

export * from './multichannel'
