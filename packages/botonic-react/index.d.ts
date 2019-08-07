import * as React from 'react'
import * as core from '@botonic/core'

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

export class NodeApp {
  constructor(options: core.BotOptions)

  renderNode(args): string

  input(_: {
    input: core.Input
    session?: core.Session
    lastRoutePath: string
  }): {
    input: core.Input
    response: React.ReactNode
    session: core.Session
    lastRoutePath: string
  }
}

// Parameters of the actions' botonicInit method
export interface ActionInitInput {
  input: core.Input
  session: core.Session
  params: any
  lastRoutePath: any
  plugins: any
}

export class BotonicInputTester {
  constructor(app: core.CoreBot)

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
  constructor(app: core.CoreBot)

  text(out: string, replies?: any): Promise<string>
}

export const RequestContext: React.Context<{
  getString: (stringId: string) => string
  setLocale: (locale: string) => string
  session: core.Session
  params: any
  input: core.Input
  defaultDelay: number
  defaultTyping: number
  lastRoutePath?: string
  plugins: { [id: string]: core.Plugin }
}>

export function msgToBotonic(msg: any): React.ReactNode
export function msgsToBotonic(msgs: any | any[]): React.ReactNode
