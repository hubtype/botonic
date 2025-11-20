import { HtAiAgentNode } from './ai-agent'
import { HtBotActionNode } from './bot-action'
import { HtCarouselNode } from './carousel'
import { HtFallbackNode } from './fallback'
import { HtFunctionNode } from './function'
import { HtGoToFlow } from './go-to-flow'
import { HtHandoffNode } from './handoff'
import { HtImageNode } from './image'
import { HtKeywordNode } from './keyword'
import { HtKnowledgeBaseNode } from './knowledge-base'
import { HtPayloadNode } from './payload'
import { HtRatingNode } from './rating'
import { HtSmartIntentNode } from './smart-intent'
import { HtTextNode } from './text'
import { HtUrlNode } from './url'
import { HtVideoNode } from './video'
import { HtWebviewNode } from './webview'
import { HtWhatsappButtonListNode } from './whatsapp-button-list'
import { HtWhatsappCTAUrlButtonNode } from './whatsapp-cta-url-button'

export type HtNodeWithContent =
  | HtTextNode
  | HtImageNode
  | HtVideoNode
  | HtCarouselNode
  | HtHandoffNode
  | HtKeywordNode
  | HtFunctionNode
  | HtFallbackNode
  | HtWhatsappButtonListNode
  | HtWhatsappCTAUrlButtonNode
  | HtSmartIntentNode
  | HtKnowledgeBaseNode
  | HtBotActionNode
  | HtAiAgentNode
  | HtRatingNode
  | HtWebviewNode
  | HtGoToFlow

export type HtNodeWithoutContent = HtUrlNode | HtPayloadNode

export type HtNodeComponent = HtNodeWithContent | HtNodeWithoutContent
