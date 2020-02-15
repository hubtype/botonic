import * as React from 'react'
import * as core from '@botonic/core'
import { ReactNode } from 'react'

export type MessageType = 'text' | 'carousel' | 'audio' | 'video' | 'location' | 'document' | 'buttonmessage' | 'custom' | 'image'

export interface MessageProps {
  type?: string
  from?: string
  delay?: number
  typing?: number
  children: any
  json: any
  style: any
}
export class Message extends React.Component<MessageProps, any> {}

export interface TextProps {
  delay?: number
  typing?: number
}
export class Text extends React.Component<TextProps, any> {}

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

export class Button extends React.Component<ButtonProps, any> {}

export type ReplyProps = ButtonProps

export class Reply extends React.Component<ReplyProps, any> {}

export interface PicProps {
  src: string
}
export class Pic extends React.Component<PicProps, any> {}
export class Image extends React.Component<PicProps, any> {}

export class Carousel extends React.Component<any, any> {}
export class Title extends React.Component<any, any> {}
export class Subtitle extends React.Component<any, any> {}
export class Element extends React.Component<any, any> {}

/**
 * See @botonic/core's Response for the description of the Response's semantics*/
export interface BotResponse extends core.BotRequest {
  response: [React.ReactNode]
}


export class NodeApp {
  constructor(options: core.BotOptions)

  renderNode(args): string

  input(request: core.BotRequest): BotResponse
}

// Parameters of the actions' botonicInit method
export interface ActionRequest {
  session: core.Session
  params: {[key: string]: string}
  input: core.Input
  plugins: { [id: string]: core.Plugin }
  defaultTyping: number,
  defaultDelay: number,
  lastRoutePath: string
}

export class BotonicInputTester {
  constructor(app: NodeApp)

  text(
    inp: string,
    session?: core.Session,
    lastRoutePath?: string
  ): Promise<string>

  payload(
    inp: string,
    session?: core.Session,
    lastRoutePath?: string
  ): Promise<string>
}

export class BotonicOutputTester {
  constructor(app: NodeApp)

  text(out: string, replies?: any): Promise<string>
}

export interface RequestContextInterface extends ActionRequest {
  getString: (stringId: string) => string
  setLocale: (locale: string) => string
}

export const RequestContext: React.Context<RequestContextInterface>

export interface CustomMessageType {
  customTypeName: string
}

export function msgToBotonic(msg: any, customMessageTypes?: CustomMessageType[]): React.ReactNode
export function msgsToBotonic(msgs: any | any[], customMessageTypes?: CustomMessageType[]): React.ReactNode
