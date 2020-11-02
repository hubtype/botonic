import * as React from 'react'

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
}

export const Button: React.FunctionComponent<ButtonProps>

export const Reply: React.FunctionComponent<ReplyProps>
export type ReplyProps = ButtonProps

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

type CustomProp = { custom?: React.Component }
type EnableProp = { enable?: boolean }
type ImageProp = { image?: string } // https URL or imported Image asset
type PersistentMenuCloseOption = { closeLabel: string }
type PersistentMenuOption = { label: string } & ButtonProps
type StyleProp = { style?: any }

export type PersistentMenuProps =
  | PersistentMenuCloseOption[]
  | PersistentMenuOption[]

export type BlockInputOption = { match: RegExp[]; message: string }

export interface BlobProps {
  blobTick?: boolean
  blobTickStyle?: any
  blobWidth?: string
  imageStyle?: any
}

export interface ScrollbarProps {
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

export interface ThemeProps {
  mobileBreakpoint: number
  mobileStyle: any
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
        enable?: boolean
        format(): string
      } & StyleProp
    }
  button?: {
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
    menu?: { darkBackground?: boolean } & CustomProp
    menuButton?: CustomProp
    persistentMenu?: PersistentMenuProps
    sendButton?: EnableProp & CustomProp
  } & EnableProp &
    StyleProp
}

export interface CoverComponentOptions {
  coverComponent: {
    component: React.Component
    props: any
  }
}

export interface WebchatSettingsProps {
  blockInputs?: BlockInputOption[]
  enableAnimations?: boolean
  enableAttachments?: boolean
  enableEmojiPicker?: boolean
  enableUserInput?: boolean
  persistentMenu?: PersistentMenuProps
  theme?: ThemeProps
}
export const WebchatSettings: React.FunctionComponent<WebchatSettingsProps>

export * from './multichannel'
