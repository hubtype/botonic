import { HtBotActionNode } from './bot-action'
import { HtCarouselNode } from './carousel'
import { HtFallbackNode } from './fallback'
import { HtFunctionNode } from './function'
import { HtGoToFlow } from './go-to-flow'
import { HtHandoffNode } from './handoff'
import { HtImageNode } from './image'
import { HtIntentNode } from './intent'
import { HtKeywordNode } from './keyword'
import { HtKnowledgeBaseNode } from './knowledge-base'
import { HtPayloadNode } from './payload'
import { HtSmartIntentNode } from './smart-intent'
import { HtTextNode } from './text'
import { HtUrlNode } from './url'
import { HtVideoNode } from './video'
import { HtWhatsappButtonListNode } from './whatsapp-button-list'
import { HtWhatsappCTAUrlButtonNode } from './whatsapp-cta-url-button'

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
  | HtWhatsappCTAUrlButtonNode
  | HtSmartIntentNode
  | HtKnowledgeBaseNode
  | HtBotActionNode

export type HtNodeWithoutContent = HtUrlNode | HtPayloadNode | HtGoToFlow

export type HtNodeComponent = HtNodeWithContent | HtNodeWithoutContent
