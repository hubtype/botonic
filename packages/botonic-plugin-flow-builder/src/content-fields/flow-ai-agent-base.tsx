import {
  type AgenticOutputMessage,
  type BotContext,
  type GuardrailRule,
  type HubtypeAssistantMessage,
  type InferenceResponse,
  OutputMessageType,
  VerbosityLevel,
} from '@botonic/core'
import {
  type FlowBuilderContentMessage,
  FlowBuilderOutputMessageType,
} from '../structured-output/flow-builder-content'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'
import { HubtypeAssistantContent } from '../utils/hubtype-assistant-content'
import { ContentFieldsBase } from './content-fields-base'
import { FlowCarousel } from './flow-carousel'
import { FlowText } from './flow-text'
import type { HtInputGuardrailRule, HtNodeWithContent } from './hubtype-fields'
import type { FlowContent } from './index'

export abstract class FlowAiAgentBase extends ContentFieldsBase {
  public name: string = ''
  public instructions: string = ''
  public model: string = ''
  public verbosity: VerbosityLevel = VerbosityLevel.Medium
  public inputGuardrailRules: HtInputGuardrailRule[] = []

  public aiAgentResponse?: InferenceResponse<FlowBuilderContentMessage>
  public messages: AgenticOutputMessage<FlowBuilderContentMessage>[] = []
  public jsxElements: JSX.Element[] = []

  abstract getAIAgentResponse(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<InferenceResponse<FlowBuilderContentMessage> | undefined>

  abstract trackAiAgentResponse(botContext: BotContext): Promise<void>

  async resolveAIAgentResponse(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<InferenceResponse<FlowBuilderContentMessage> | undefined> {
    const aiAgentResponse = await this.getAIAgentResponse(
      botContext,
      previousContents
    )

    if (aiAgentResponse) {
      this.aiAgentResponse = aiAgentResponse
      await this.trackAiAgentResponse(botContext)
      this.messages = aiAgentResponse.messages
    }

    return aiAgentResponse
  }

  async trackFlow(_botContext: BotContext): Promise<void> {
    return
  }

  async getFlowContentsByContentId(
    botContext: BotContext,
    contentId: string
  ): Promise<FlowContent[]> {
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    const cmsApi = flowBuilderPlugin.cmsApi
    const node = cmsApi.getNodeByContentID(contentId)
    const flowContents = await flowBuilderPlugin.getContentsByNode(
      node as HtNodeWithContent
    )

    return flowContents
  }

  async messagesToBotonicJSXElements(botContext: BotContext): Promise<void> {
    for (const message of this.messages) {
      if (
        message.type === OutputMessageType.Text ||
        message.type === OutputMessageType.TextWithButtons ||
        message.type === OutputMessageType.BotExecutor
      ) {
        this.jsxElements.push(FlowText.fromAIAgent(this.id, message))
      }

      if (message.type === OutputMessageType.Carousel) {
        this.jsxElements.push(
          FlowCarousel.fromAIAgent(this.id, message, botContext)
        )
      }

      if (message.type === FlowBuilderOutputMessageType.FlowBuilderContent) {
        const flowContents = await this.getFlowContentsByContentId(
          botContext,
          message.contentId
        )
        for (const content of flowContents) {
          await content.processContent(botContext)
          this.jsxElements.push(content.toBotonic(botContext))
        }
      }
    }
    return
  }

  async processContent(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<void> {
    if (this.messages.length === 0) {
      await this.resolveAIAgentResponse(botContext, previousContents)
    }
    if (this.jsxElements.length === 0) {
      await this.filterContent(botContext, this as unknown as FlowContent)
      await this.messagesToBotonicJSXElements(botContext)
    }
    return
  }

  toBotonic(): JSX.Element {
    return <>{this.jsxElements}</>
  }

  protected getPreviousHubtypeContents(
    previousContents?: FlowContent[]
  ): HubtypeAssistantMessage[] {
    return (
      previousContents?.map(content => {
        return {
          role: 'assistant',
          content: HubtypeAssistantContent.adapt(content),
        }
      }) || []
    )
  }

  protected getActiveInputGuardrailRules(
    inputGuardrailRules: HtInputGuardrailRule[]
  ): GuardrailRule[] {
    return (
      inputGuardrailRules
        ?.filter(rule => rule.is_active)
        ?.map(rule => ({
          name: rule.name,
          description: rule.description,
        })) || []
    )
  }
}
