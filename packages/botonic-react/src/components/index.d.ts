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

export const Text: React.FunctionComponent<MessageProps>

export interface Webview {
  name: string
}

export interface ButtonProps {
  payload?: string
  url?: string
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

export * from './multichannel'
