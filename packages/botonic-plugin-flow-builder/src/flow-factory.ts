import type { BotContext } from '@botonic/core'

import type { FlowBuilderApi } from './api'
import {
  FlowAiAgent,
  FlowAiAgentRouter,
  FlowBotAction,
  FlowCarousel,
  FlowChannelConditional,
  type FlowContent,
  FlowCountryConditional,
  FlowCustomConditional,
  FlowGoToFlow,
  FlowHandoff,
  FlowImage,
  FlowKnowledgeBase,
  FlowQueueStatusConditional,
  FlowRating,
  FlowText,
  FlowVideo,
  FlowWhatsappButtonList,
  FlowWhatsappCtaUrlButtonNode,
  FlowWhatsappTemplate,
} from './content-fields'
import { FlowCaptureUserInput } from './content-fields/flow-capture-user-input'
import {
  type HtFunctionNode,
  type HtNodeComponent,
  HtNodeWithContentType,
} from './content-fields/hubtype-fields'

export class FlowFactory {
  public botContext: BotContext
  public cmsApi: FlowBuilderApi
  public locale: string

  constructor(botContext: BotContext, cmsApi: FlowBuilderApi, locale: string) {
    this.botContext = botContext
    this.cmsApi = cmsApi
    this.locale = locale
  }

  async getFlowContent(
    hubtypeContent: HtNodeComponent
  ): Promise<FlowContent | undefined> {
    switch (hubtypeContent.type) {
      case HtNodeWithContentType.TEXT:
        return FlowText.fromHubtypeCMS(hubtypeContent, this.locale, this.cmsApi)
      case HtNodeWithContentType.IMAGE:
        return FlowImage.fromHubtypeCMS(hubtypeContent, this.locale)
      case HtNodeWithContentType.CAROUSEL:
        return FlowCarousel.fromHubtypeCMS(
          hubtypeContent,
          this.locale,
          this.cmsApi
        )
      case HtNodeWithContentType.VIDEO:
        return FlowVideo.fromHubtypeCMS(hubtypeContent, this.locale)
      case HtNodeWithContentType.WHATSAPP_BUTTON_LIST:
        return FlowWhatsappButtonList.fromHubtypeCMS(
          hubtypeContent,
          this.locale,
          this.cmsApi
        )
      case HtNodeWithContentType.WHATSAPP_CTA_URL_BUTTON:
        return FlowWhatsappCtaUrlButtonNode.fromHubtypeCMS(
          hubtypeContent,
          this.locale,
          this.cmsApi
        )
      case HtNodeWithContentType.HANDOFF:
        return FlowHandoff.fromHubtypeCMS(
          hubtypeContent,
          this.locale,
          this.cmsApi
        )

      case HtNodeWithContentType.KNOWLEDGE_BASE:
        return FlowKnowledgeBase.fromHubtypeCMS(hubtypeContent)

      case HtNodeWithContentType.AI_AGENT_ROUTER:
        return FlowAiAgentRouter.fromHubtypeCMS(hubtypeContent, this.botContext)

      case HtNodeWithContentType.AI_AGENT:
        return FlowAiAgent.fromHubtypeCMS(hubtypeContent, this.botContext)

      case HtNodeWithContentType.RATING:
        return FlowRating.fromHubtypeCMS(hubtypeContent, this.locale)

      case HtNodeWithContentType.BOT_ACTION:
        return FlowBotAction.fromHubtypeCMS(hubtypeContent, this.cmsApi)

      case HtNodeWithContentType.FUNCTION:
        return this.resolveFlowFunctionContent(hubtypeContent)

      case HtNodeWithContentType.GO_TO_FLOW:
        return FlowGoToFlow.fromHubtypeCMS(hubtypeContent, this.cmsApi)

      case HtNodeWithContentType.WHATSAPP_TEMPLATE:
        return FlowWhatsappTemplate.fromHubtypeCMS(hubtypeContent, this.locale)

      case HtNodeWithContentType.CAPTURE_USER_INPUT:
        return FlowCaptureUserInput.fromHubtypeCMS(hubtypeContent)

      default:
        return undefined
    }
  }

  private async resolveFlowFunctionContent(
    hubtypeContent: HtFunctionNode
  ): Promise<FlowContent | undefined> {
    switch (hubtypeContent.content.action) {
      case 'check-country':
        return FlowCountryConditional.fromHubtypeCMS(
          hubtypeContent,
          this.botContext
        )
      case 'get-channel-type':
        return FlowChannelConditional.fromHubtypeCMS(
          hubtypeContent,
          this.botContext
        )
      case 'check-queue-status':
        return FlowQueueStatusConditional.fromHubtypeCMS(
          hubtypeContent,
          this.locale
        )
      case 'check-bot-variable':
        return FlowCustomConditional.fromHubtypeCMS(
          hubtypeContent,
          this.botContext
        )
      default:
        return undefined
    }
  }
}
