import type { HtAiAgentNode } from './ai-agent'
import type { HtBotActionNode } from './bot-action'
import type { HtCaptureUserInputNode } from './capture-user-input'
import type { HtCarouselNode } from './carousel'
// import { HtChannelConditionalNode } from './channel-conditional'
// import { HtCountryConditionalNode } from './country-conditional'
// import { HtCustomConditionalNode } from './custom-conditional'
import type { HtFallbackNode } from './fallback'
import type { HtFunctionNode } from './function'
import type { HtGoToFlow } from './go-to-flow'
import type { HtHandoffNode } from './handoff'
import type { HtImageNode } from './image'
import type { HtKeywordNode } from './keyword'
import type { HtKnowledgeBaseNode } from './knowledge-base'
import type { HtPayloadNode } from './payload'
// import { HtQueueStatusConditionalNode } from './queue-status-conditional'
import type { HtRatingNode } from './rating'
import type { HtSmartIntentNode } from './smart-intent'
import type { HtTextNode } from './text'
import type { HtUrlNode } from './url'
import type { HtVideoNode } from './video'
import type { HtWebviewNode } from './webview'
import type { HtWhatsappButtonListNode } from './whatsapp-button-list'
import type { HtWhatsappCTAUrlButtonNode } from './whatsapp-cta-url-button'
import type { HtWhatsappTemplateNode } from './whatsapp-template'

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
  | HtWhatsappTemplateNode
  | HtCaptureUserInputNode
// | HtChannelConditionalNode
// | HtCountryConditionalNode
// | HtCustomConditionalNode
// | HtQueueStatusConditionalNode

export type HtNodeWithoutContent = HtUrlNode | HtPayloadNode

export type HtNodeComponent = HtNodeWithContent | HtNodeWithoutContent
