export interface FlowBuilderData {
  version: string
  name: string
  locales: string[]
  start_node_id?: string
  ai_model_id?: string
  nodes: NodeComponent[]
}

export enum NodeType {
  TEXT = 'text',
  IMAGE = 'image',
  CAROUSEL = 'carousel',
  HANDOFF = 'handoff',
  KEYWORD = 'keyword',
  INTENT = 'intent',
  START_UP = 'start-up',
  URL = 'url',
  PAYLOAD = 'payload',
  FUNCTION = 'function',
}

export interface BaseNode {
  id: string
  type: NodeType
}

export interface Meta {
  x: number
  y: number
}

export interface Node extends BaseNode {
  code: string
  meta: Meta
  follow_up?: NodeLink
  target?: NodeLink
}

export interface NodeLink {
  id: string
  type: NodeType
}

export interface TextLocale {
  message: string
  locale: string
}

export enum ButtonStyle {
  BUTTON = 'button',
  QUICK_REPLY = 'quick-reply',
}

export interface UrlLocale {
  id: string
  locale: string
}

export interface PayloadLocale {
  id: string
  locale: string
}

export interface Button {
  id: string
  text: TextLocale[]
  target?: NodeLink
  hidden: string
  url?: UrlLocale
  payload?: PayloadLocale[]
}

export interface TextNodeContent {
  text: TextLocale[]
  buttons_style?: ButtonStyle
  buttons: Button[]
}

export interface TextNode extends Node {
  type: NodeType.TEXT
  content: TextNodeContent
}

export interface MediaFileLocale {
  id: string
  file: string
  locale: string
}

export interface ImageNodeContent {
  image: MediaFileLocale[]
}

export interface ImageNode extends Node {
  type: NodeType.IMAGE
  content: ImageNodeContent
}

export interface CarouselElementNode {
  id: string
  title: TextLocale[]
  subtitle: TextLocale[]
  image: MediaFileLocale[]
  button: Button
}

export interface CarouselNodeContent {
  elements: CarouselElementNode[]
}

export interface CarouselNode extends Node {
  type: NodeType.CAROUSEL
  content: CarouselNodeContent
}

export interface QueueLocale {
  id: string
  name: string
  locale: string
}

export interface HandoffNodeContent {
  message: TextLocale[]
  fail_message: TextLocale[]
  queue: QueueLocale[]
}

export interface HandoffNode extends Node {
  type: NodeType.HANDOFF
  content: HandoffNodeContent
}

export interface InputLocale {
  values: string[]
  locale: string
}

export interface KeywordNodeContent {
  title: TextLocale[]
  keywords: InputLocale[]
}
export interface KeywordNode extends Node {
  type: NodeType.KEYWORD
  content: KeywordNodeContent
}

export interface IntentNodeContent {
  title: TextLocale[]
  intents: InputLocale[]
  confidence: number
}
export interface IntentNode extends Node {
  type: NodeType.INTENT
  content: IntentNodeContent
}

export interface StartNode extends BaseNode {
  type: NodeType.START_UP
  target: NodeLink
}

export interface UrlNodeContent {
  url: string
}

export interface UrlNode extends BaseNode {
  type: NodeType.URL
  content: UrlNodeContent
}

export interface PayloadNodeContent {
  payload: string
}

export interface PayloadNode extends BaseNode {
  type: NodeType.PAYLOAD
  content: PayloadNodeContent
}

export type ArgumentType = number | string | Record<any, any>

export interface FunctionNodeArgument {
  type: ArgumentType
  name: string
  value: string
}

export interface FunctionNodeArgumentLocale {
  locale: string
  values: FunctionNodeArgument[]
}

export interface FunctionNodeResult {
  result: string
  target: NodeLink
}

export interface FunctionNodeContent {
  action: string
  arguments: FunctionNodeArgumentLocale[]
  result_mapping: FunctionNodeResult[]
}

export interface FunctionNode extends Node {
  type: NodeType.FUNCTION
  content: FunctionNodeContent
}

export type NodeComponent =
  | TextNode
  | ImageNode
  | CarouselNode
  | HandoffNode
  | KeywordNode
  | IntentNode
  | UrlNode
  | StartNode
  | PayloadNode
  | FunctionNode
