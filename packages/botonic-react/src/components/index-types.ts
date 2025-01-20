import React from 'react'

import { SENDERS } from '../index-types'

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

export interface CustomMessageType {
  (props: any): JSX.Element
  customTypeName: string
  deserialize(msg: any): JSX.Element
}

export type BlockInputOption = {
  preprocess?: (message: string) => string
  match: RegExp[]
  message: string
}

export type WrappedComponent<Props> = React.FunctionComponent<Props> & {
  customTypeName: string
}
