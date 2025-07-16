import { FlowAiAgent } from './flow-ai-agent'
import { FlowBotAction } from './flow-bot-action'
import { FlowCarousel } from './flow-carousel'
import { FlowHandoff } from './flow-handoff'
import { FlowImage } from './flow-image'
import {
  DISABLED_MEMORY_LENGTH,
  FlowKnowledgeBase,
} from './flow-knowledge-base'
import { FlowRating } from './flow-rating'
import { FlowText } from './flow-text'
import { FlowVideo } from './flow-video'
import { FlowWhatsappCtaUrlButtonNode } from './flow-whatsapp-cta-url-button'
import { FlowWhatsappButtonList } from './whatsapp-button-list/flow-whatsapp-button-list'

export { ContentFieldsBase } from './content-fields-base'
export { FlowButton } from './flow-button'
export { FlowElement } from './flow-element'
export {
  FlowAiAgent,
  FlowBotAction,
  FlowCarousel,
  FlowHandoff,
  FlowImage,
  FlowKnowledgeBase,
  FlowText,
  FlowVideo,
  FlowWhatsappButtonList,
  FlowWhatsappCtaUrlButtonNode,
}

export type FlowContent =
  | FlowCarousel
  | FlowImage
  | FlowText
  | FlowVideo
  | FlowWhatsappButtonList
  | FlowWhatsappCtaUrlButtonNode
  | FlowHandoff
  | FlowKnowledgeBase
  | FlowBotAction
  | FlowAiAgent
  | FlowRating

export { DISABLED_MEMORY_LENGTH }
