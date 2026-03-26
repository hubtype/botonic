import {
  type AgenticOutputMessage,
  type BotContext,
  EventAction,
  type EventAiAgent,
  type GuardrailRule,
  type HubtypeAssistantMessage,
  type InferenceResponse,
  VerbosityLevel,
} from '@botonic/core'
import { getFlowBuilderPlugin } from '../helpers'
import {
  type FlowBuilderContentMessage,
  FlowBuilderContentSchema,
} from '../structured-output/flow-builder-content'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowCarousel } from './flow-carousel'
import { FlowText } from './flow-text'
import { HubtypeAssistantContent } from './hubtype-assistant-content'
import type { HtNodeWithContent } from './hubtype-fields'
import type {
  HtAiAgentNode,
  HtInputGuardrailRule,
} from './hubtype-fields/ai-agent'
import type { FlowContent } from './index'

export class FlowAiAgent extends ContentFieldsBase {
  public name: string = ''
  public instructions: string = ''
  public model: string = ''
  public verbosity: VerbosityLevel = VerbosityLevel.Medium
  public activeTools?: { name: string }[]
  public inputGuardrailRules: HtInputGuardrailRule[]
  public sources?: { id: string; name: string }[]

  public aiAgentResponse?: InferenceResponse<FlowBuilderContentMessage>
  public messages: AgenticOutputMessage<FlowBuilderContentMessage>[] = []
  public jsxElements: JSX.Element[] = []

  static fromHubtypeCMS(component: HtAiAgentNode): FlowAiAgent {
    const newAiAgent = new FlowAiAgent(component.id)
    newAiAgent.code = component.code
    newAiAgent.name = component.content.name
    newAiAgent.instructions = component.content.instructions
    newAiAgent.model = component.content.model
    newAiAgent.verbosity = component.content.verbosity
    newAiAgent.activeTools = component.content.active_tools
    newAiAgent.inputGuardrailRules =
      component.content.input_guardrail_rules || []
    newAiAgent.sources = component.content.sources
    newAiAgent.followUp = component.follow_up

    return newAiAgent
  }

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
      await this.messagesToBotonicJSXElements(botContext)
    }

    return aiAgentResponse
  }

  async getAIAgentResponse(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<InferenceResponse<FlowBuilderContentMessage> | undefined> {
    const previousHubtypeContents: HubtypeAssistantMessage[] =
      previousContents?.map(content => {
        return {
          role: 'assistant',
          content: HubtypeAssistantContent.adapt(content),
        }
      }) || []

    const activeInputGuardrailRules: GuardrailRule[] =
      this.inputGuardrailRules
        ?.filter(rule => rule.is_active)
        ?.map(rule => ({
          name: rule.name,
          description: rule.description,
        })) || []

    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)

    const aiAgentResponse = await flowBuilderPlugin.getAiAgentResponse?.(
      botContext,
      {
        name: this.name,
        instructions: this.instructions,
        model: this.model,
        verbosity: this.verbosity,
        activeTools: this.activeTools,
        inputGuardrailRules: activeInputGuardrailRules,
        sourceIds: this.sources?.map(source => source.id),
        outputMessagesSchemas: [FlowBuilderContentSchema],
        previousHubtypeMessages: previousHubtypeContents,
      }
    )

    return aiAgentResponse
  }

  async trackFlow(): Promise<void> {
    return
  }

  async trackAiAgentResponse(botContext: BotContext) {
    const { flowThreadId, flowId, flowName, flowNodeId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)

    const event: EventAiAgent = {
      action: EventAction.AiAgent,
      flowThreadId: flowThreadId,
      flowId: flowId,
      flowName: flowName,
      flowNodeId: flowNodeId,
      flowNodeContentId: this.name,
      flowNodeIsMeaningful: true,
      toolsExecuted: this.aiAgentResponse?.toolsExecuted ?? [],
      memoryLength: this.aiAgentResponse?.memoryLength ?? 0,
      inputMessageId: botContext.input.message_id!,
      exit: this.aiAgentResponse?.exit ?? true,
      inputGuardrailsTriggered:
        this.aiAgentResponse?.inputGuardrailsTriggered ?? [],
      outputGuardrailsTriggered: [], //aiAgentResponse.outputGuardrailsTriggered,
      error: this.aiAgentResponse?.error ?? false,
    }
    const { action, ...eventArgs } = event

    await trackEvent(botContext, action, eventArgs)
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
        message.type === 'text' ||
        message.type === 'textWithButtons' ||
        message.type === 'botExecutor'
      ) {
        this.jsxElements.push(FlowText.fromAIAgent(this.id, message))
      }

      if (message.type === 'carousel') {
        this.jsxElements.push(
          FlowCarousel.fromAIAgent(this.id, message, botContext)
        )
      }

      if (message.type === 'flowBuilderContent') {
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
    return
  }

  toBotonic(): JSX.Element {
    return <>{this.jsxElements}</>
  }
}
