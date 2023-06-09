import { HtCarouselNode } from './carousel'
import { HtFallbackNode } from './fallback'
import { HtFunctionNode } from './function'
import { HtHandoffNode } from './handoff'
import { HtImageNode } from './image'
import { HtIntentNode } from './intent'
import { HtKeywordNode } from './keyword'
import { HtPayloadNode } from './payload'
import { HtStartNode } from './start'
import { HtTextNode } from './text'
import { HtUrlNode } from './url'
import { HtVideoNode } from './video'
import { HtWhatsappButtonListNode } from './whatsapp-button-list'

export type HtNodeWithContent =
  | HtTextNode
  | HtImageNode
  | HtVideoNode
  | HtCarouselNode
  | HtHandoffNode
  | HtKeywordNode
  | HtIntentNode
  | HtFunctionNode
  | HtFallbackNode
  | HtWhatsappButtonListNode

export type HtNodeWithoutContent = HtUrlNode | HtPayloadNode

export type HtNodeComponent =
  | HtNodeWithContent
  | HtNodeWithoutContent
  | HtStartNode
