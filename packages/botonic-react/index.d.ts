import * as React from 'react';
import * as core from '@botonic/core';

export interface MessageProps{
  type? : string;
  from? : string;
  delay? : number;
  typing? : number;
  children : any;
  json: any;
  style: any;
}
export class Message extends React.Component<MessageProps, any> {}


//TODO inherit from MessageProps?
export interface TextProps{
  delay?: number;
  typing?: number;
}
export class Text extends React.Component<TextProps, any> {}

export interface ButtonProps{
  payload?: string;
  url?: string;
}
export class Button extends React.Component<ButtonProps, any> {}

export interface ButtonProps{
  payload?: string;
  url?: string;
}
export class Reply extends React.Component<ButtonProps, any> {}

export interface PicProps{
  src: string;
}
export class Pic extends React.Component<PicProps, any> {}
export class Image extends React.Component<PicProps, any> {}

export class Carousel extends React.Component<any, any> {}
export class Title extends React.Component<any, any> {}
export class Subtitle extends React.Component<any, any> {}
export class Element extends React.Component<any, any> {}

export type Locales = {[id: string]: string|string[]|Locales };

export class App {
  routes: core.Route[]
  locales: Locales;
  integrations?: {[id: string]: any};
  theme?: string;
  plugins: { [id: string]: any};
  defaultTyping : number;
  defaultDelay : number;

  constructor(app: {
    routes: core.Route[],
    locales: Locales,
    integrations?: {[id: string]: any};
    theme?: string,
    plugins?: { [id: string]: any},
    defaultTyping?: number,
    defaultDelay?: number
  });
}

export interface Input {
  type: string; // text, postback...
  payload?: string;
  data?: string;
}

export interface Session {
  is_first_interaction?: boolean,
  last_session?: any,
  user: {
    id: string
    // login
    username?: string,
    // person name
    name?: string,
    // whatsapp, telegram,...
    provider?: string,
    // The provider's user id
    provider_id?: string,
    extra_data?: any
  },
  bot: {
    id: string,
    name?: string
  }
  __locale?: string,
  __retries?: number
}
// Parameters of the actions' botonicInit method
export interface ActionInitInput {
  input : Input;
  session: Session;
  params: any;
  lastRoutePath: any;
  plugins: any;
}

export class BotonicInputTester {
  constructor(app: App);

  text(inp: string, session?: Session, lastRoutePath?: string): Promise<string>;

  payload(inp: string, session?: Session, lastRoutePath?: string): Promise<string>;
}

export class BotonicOutputTester {
  constructor(app: any);

  text(out: string, replies?: any): Promise<string>;
}

export const RequestContext: React.Context<any>;


// plugins

// Arguments of the plugin pre() method
export interface PluginPreInput {
  input: Input;
  session: Session;
  lastRoutePath: string;
}

// Arguments of the plugin post() method
export interface PluginPostInput {
  input: Input;
  session: Session;
  lastRoutePath: string;
  response: string;
}
