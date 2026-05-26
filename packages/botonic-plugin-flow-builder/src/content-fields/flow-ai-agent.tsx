import {
  AiAgentType,
  type BotContext,
  EventAction,
  type EventAiAgent,
  type InferenceResponse,
} from '@botonic/core'
import {
  type FlowBuilderContentMessage,
  FlowBuilderContentSchema,
} from '../structured-output/flow-builder-content'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'
import { FlowAiAgentBase } from './flow-ai-agent-base'
import type { HtAiAgentNode } from './hubtype-fields/ai-agent'
import type { FlowContent } from './index'

export class FlowAiAgent extends FlowAiAgentBase {
  public activeTools?: { name: string }[]
  public sources?: { id: string; name: string }[]

  static fromHubtypeCMS(
    component: HtAiAgentNode,
    botContext: BotContext
  ): FlowAiAgent {
    const newAiAgent = new FlowAiAgent(component.id)
    newAiAgent.code = component.code
    newAiAgent.name = component.content.name
    newAiAgent.instructions = newAiAgent.replaceVariables(
      component.content.instructions,
      botContext
    )
    newAiAgent.model = component.content.model
    newAiAgent.verbosity = component.content.verbosity
    newAiAgent.activeTools = component.content.active_tools
    newAiAgent.inputGuardrailRules =
      component.content.input_guardrail_rules || []
    newAiAgent.sources = component.content.sources
    newAiAgent.followUp = component.follow_up

    return newAiAgent
  }

  async getAIAgentResponse(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<InferenceResponse<FlowBuilderContentMessage> | undefined> {
    const activeInputGuardrailRules = this.getActiveInputGuardrailRules(
      this.inputGuardrailRules
    )

    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)

    const aiAgentResponse = await flowBuilderPlugin.getAiAgentResponse?.(
      botContext,
      {
        type: AiAgentType.Specialist,
        name: this.name,
        instructions: this.instructions,
        model: this.model,
        verbosity: this.verbosity,
        activeTools: this.activeTools ?? [],
        inputGuardrailRules: activeInputGuardrailRules,
        sourceIds: this.sources?.map(source => source.id) ?? [],
        outputMessagesSchemas: [FlowBuilderContentSchema],
        previousHubtypeMessages:
          this.getPreviousHubtypeContents(previousContents),
      }
    )

    return aiAgentResponse
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
}
