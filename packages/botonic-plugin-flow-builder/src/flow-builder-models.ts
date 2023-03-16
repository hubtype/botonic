export enum ButtonStyle {
  BUTTON = 'button',
  QUICK_REPLY = 'quick-reply',
}

export enum MessageContentType {
  CAROUSEL = 'carousel',
  IMAGE = 'image',
  TEXT = 'text',
  KEYWORD = 'keyword',
  HANDOFF = 'handoff',
  FUNCTION = 'function',
  INTENT = 'intent',
}

// TODO: refactor types correctly
export enum NonMessageContentType {
  INTENT = 'intent',
  PAYLOAD = 'payload',
  QUEUE = 'queue',
  URL = 'url',
}

export enum SubContentType {
  BUTTON = 'button',
  ELEMENT = 'element',
}

export enum MediaContentType {
  ASSET = 'asset',
}

export enum StartFieldsType {
  START_UP = 'start-up',
}

export enum InputContentType {
  INPUT = 'user-input',
}

export enum InputType {
  INTENTS = 'intents',
  KEYWORDS = 'keywords',
}

export const NodeContentType = {
  ...MessageContentType,
  ...InputContentType,
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NodeContentType = MessageContentType | InputContentType

export interface FlowBuilderData {
  version: string
  name: string
  locales: string[]
  start_node_id?: string
  ai_model_id?: string
  nodes: NodeComponent[]
}

export interface NodeLink {
  id: string
  type: NodeContentType
}

export interface StartReference {
  id: string
  type: NodeContentType
  target: NodeLink
}

export interface Base {
  id: string
  type: NodeContentType | StartFieldsType
}

export interface BaseNode extends Base {
  code: string
  meta: {
    x: number
    y: number
  }
  follow_up?: NodeLink
  target?: NodeLink
}

export interface TextLocale {
  message: string
  locale: string
}
export interface InputLocale {
  values: string[]
  locale: string
}
export interface MediaFileLocale {
  id: string
  file: string
  locale: string
}

export interface TextNode extends BaseNode {
  type: MessageContentType.TEXT
  content: {
    text: TextLocale[]
    buttons_style?: ButtonStyle
    buttons: Button[]
  }
}

export interface Button {
  id: string
  text: TextLocale[]
  target?: NodeLink
  hidden: string[]
}

export interface ImageNode extends BaseNode {
  type: MessageContentType.IMAGE
  content: {
    image: MediaFileLocale[]
  }
}

export interface CarouselNode extends BaseNode {
  type: MessageContentType.CAROUSEL
  content: {
    elements: Element[]
  }
}

export interface Element {
  id: string
  title: TextLocale[]
  subtitle: TextLocale[]
  image: MediaFileLocale[]
  button: Button
  hidden: string[]
}

export interface IntentNode extends BaseNode {
  type: MessageContentType.INTENT
  content: {
    title: TextLocale[]
    intents: InputLocale[]
    confidence: number
  }
}
export interface KeywordNode extends BaseNode {
  type: MessageContentType.KEYWORD
  content: {
    title: TextLocale[]
    keywords: InputLocale[]
  }
}

export interface HandoffNode extends BaseNode {
  type: MessageContentType.HANDOFF
  content: {
    queue: QueueLocale[]
    message: TextLocale[]
    failMessage: TextLocale[]
  }
}

export interface QueueLocale {
  id: string
  name: string
  locale: string
}

export interface FunctionNode extends BaseNode {
  type: MessageContentType.FUNCTION
  content: {
    subtype: string
    action: string
    arguments: Array<any>
    result_mapping: Array<any>
  }
}

export type NodeComponent =
  | TextNode
  | ImageNode
  | CarouselNode
  | IntentNode
  | KeywordNode
  | HandoffNode
  | FunctionNode
