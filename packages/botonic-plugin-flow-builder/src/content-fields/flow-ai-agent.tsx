import {
  type AgenticOutputMessage,
  EventAction,
  type EventAiAgent,
  type GuardrailRule,
  type HubtypeAssistantMessage,
  type InferenceResponse,
  VerbosityLevel,
} from '@botonic/core'
import type { ActionRequest as BotContext } from '@botonic/react'
import { getFlowBuilderPlugin } from '../helpers'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowCarousel } from './flow-carousel'
import { FlowText } from './flow-text'
import { HubtypeAssistantContent } from './hubtype-assistant-content'
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

  public aiAgentResponse?: InferenceResponse
  public messages: AgenticOutputMessage[] = []

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

  async resolveAIAgentMessages(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<void> {
    const aiAgentResponse = await this.getAIAgentResponse(
      botContext,
      previousContents
    )
    if (aiAgentResponse) {
      this.aiAgentResponse = aiAgentResponse
      await this.trackAiAgentResponse(botContext)
      this.messages = aiAgentResponse.messages
    }
  }

  async getAIAgentResponse(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<InferenceResponse | undefined> {
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

  toBotonic(id: string, botContext: BotContext): JSX.Element {
    return (
      <>
        {this.messages.map((response: AgenticOutputMessage) => {
          if (
            response.type === 'text' ||
            response.type === 'textWithButtons' ||
            response.type === 'botExecutor'
          ) {
            return FlowText.fromAIAgent(id, response)
          }

          if (response.type === 'carousel') {
            return FlowCarousel.fromAIAgent(id, response, botContext)
          }

          return <></>
        })}
      </>
    )
  }
}
