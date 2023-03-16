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

export interface HtFlowBuilderData {
  version: string
  name: string
  locales: string[]
  start_node_id?: string
  ai_model_id?: string
  nodes: HtNodeComponent[]
}

export interface HtNodeLink {
  id: string
  type: NodeContentType
}

export interface HtStartReference {
  id: string
  type: NodeContentType
  target: HtNodeLink
}

export interface HtBase {
  id: string
  type: NodeContentType | StartFieldsType
}

export interface HtBaseNode extends HtBase {
  code: string
  meta: {
    x: number
    y: number
  }
  follow_up?: HtNodeLink
  target?: HtNodeLink
}

export interface HtTextLocale {
  message: string
  locale: string
}
export interface HtInputLocale {
  values: string[]
  locale: string
}
export interface HtMediaFileLocale {
  id: string
  file: string
  locale: string
}

export interface HtTextNode extends HtBaseNode {
  type: MessageContentType.TEXT
  content: {
    text: HtTextLocale[]
    buttons_style?: ButtonStyle
    buttons: HtButton[]
  }
}

export interface HtButton {
  id: string
  text: HtTextLocale[]
  target?: HtNodeLink
  hidden: string[]
}

export interface HtImageNode extends HtBaseNode {
  type: MessageContentType.IMAGE
  content: {
    image: HtMediaFileLocale[]
  }
}

export interface HtCarouselNode extends HtBaseNode {
  type: MessageContentType.CAROUSEL
  content: {
    elements: HtElement[]
  }
}

export interface HtElement {
  id: string
  title: HtTextLocale[]
  subtitle: HtTextLocale[]
  image: HtMediaFileLocale[]
  button: HtButton
  hidden: string[]
}

export interface HtIntentNode extends HtBaseNode {
  type: MessageContentType.INTENT
  content: {
    title: HtTextLocale[]
    intents: HtInputLocale[]
    confidence: number
  }
}
export interface HtKeywordNode extends HtBaseNode {
  type: MessageContentType.KEYWORD
  content: {
    title: HtTextLocale[]
    keywords: HtInputLocale[]
  }
}

export interface HtHandoffNode extends HtBaseNode {
  type: MessageContentType.HANDOFF
  content: {
    queue: HtQueueLocale[]
    message: HtTextLocale[]
    failMessage: HtTextLocale[]
  }
}

export interface HtQueueLocale {
  id: string
  name: string
  locale: string
}

export interface HtFunctionNode extends HtBaseNode {
  type: MessageContentType.FUNCTION
  content: {
    subtype: string
    action: string
    arguments: Array<any>
    result_mapping: Array<any>
  }
}

export type HtNodeComponent =
  | HtTextNode
  | HtImageNode
  | HtCarouselNode
  | HtIntentNode
  | HtKeywordNode
  | HtHandoffNode
  | HtFunctionNode
