import {
  AiAgentType,
  type BotContext,
  EventAction,
  type EventAiAgent,
  type EventAiAgentRouter,
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
import { FlowAiAgent } from './flow-ai-agent'
import { FlowAiAgentBase } from './flow-ai-agent-base'
import type { HtAiAgentNode, HtAiAgentRouterNode } from './hubtype-fields'
import type { FlowContent } from './index'

export interface AvailableSpecialists {
  agent: FlowAiAgent
  description: string
  name: string
}

export class FlowAiAgentRouter extends FlowAiAgentBase {
  public availableSpecialists: AvailableSpecialists[] = []

  static fromHubtypeCMS(
    component: HtAiAgentRouterNode,
    botContext: BotContext
  ): FlowAiAgentRouter {
    const newAiAgentRouter = new FlowAiAgentRouter(component.id)
    newAiAgentRouter.code = component.code
    newAiAgentRouter.name = component.content.name
    newAiAgentRouter.instructions = newAiAgentRouter.replaceVariables(
      component.content.instructions,
      botContext
    )
    newAiAgentRouter.model = component.content.model
    newAiAgentRouter.verbosity = component.content.verbosity
    newAiAgentRouter.availableSpecialists =
      FlowAiAgentRouter.getAvailableSpecialistsFromHubtypeCMS(
        component,
        botContext
      )
    newAiAgentRouter.inputGuardrailRules =
      component.content.input_guardrail_rules || []
    return newAiAgentRouter
  }

  private static getAvailableSpecialistsFromHubtypeCMS(
    component: HtAiAgentRouterNode,
    botContext: BotContext
  ): AvailableSpecialists[] {
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    const cmsApi = flowBuilderPlugin.cmsApi

    return component.content.available_specialists.map((agentSlot, index) => {
      const aiAgentSpecialistNode = cmsApi.getNodeById<HtAiAgentNode>(
        agentSlot.target.id
      )
      const specialist = FlowAiAgent.fromHubtypeCMS(
        aiAgentSpecialistNode,
        botContext
      )
      const specialistName = FlowAiAgentRouter.specialistAgentBaseName(
        agentSlot.name,
        index
      )
      const specialistDescription = specialist.replaceVariables(
        agentSlot.description || `Transfer to ${specialistName}`,
        botContext
      )

      return {
        agent: specialist,
        description: specialistDescription,
        name: `transfer_to_${specialistName}`,
      }
    })
  }

  private static specialistAgentBaseName(
    name: string | undefined,
    index: number
  ): string {
    return name?.trim().toLowerCase().replace(/ /g, '_') || `ai_agent_${index}`
  }

  async getAIAgentResponse(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<InferenceResponse<FlowBuilderContentMessage> | undefined> {
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    const aiAgentResponse = await flowBuilderPlugin.getAiAgentResponse?.(
      botContext,
      {
        type: AiAgentType.Router,
        name: this.name,
        instructions: this.instructions,
        model: this.model,
        verbosity: this.verbosity,
        specialists: this.availableSpecialists.map(
          ({ agent, description, name }) => ({
            type: AiAgentType.Specialist,
            name,
            description,
            instructions: agent.instructions,
            model: agent.model,
            verbosity: agent.verbosity,
            activeTools: agent.activeTools ?? [],
            inputGuardrailRules: this.getActiveInputGuardrailRules(
              agent.inputGuardrailRules
            ),
            sourceIds: agent.sources?.map(s => s.id) ?? [],
          })
        ),
        inputGuardrailRules: this.getActiveInputGuardrailRules(
          this.inputGuardrailRules
        ),
        outputMessagesSchemas: [FlowBuilderContentSchema],
        previousHubtypeMessages:
          this.getPreviousHubtypeContents(previousContents),
      }
    )

    return aiAgentResponse
  }

  async trackAiAgentResponse(botContext: BotContext) {
    const isTransferredToSpecialist =
      this.aiAgentResponse?.isTransferredToSpecialist ?? false

    await this.trackAIAgentRouterEvent(botContext, isTransferredToSpecialist)

    if (isTransferredToSpecialist) {
      await this.trackAIAgentSpecialistEvent(botContext)
    }
  }

  private async trackAIAgentRouterEvent(
    botContext: BotContext,
    isTransferredToSpecialist: boolean
  ) {
    const { flowThreadId, flowId, flowName, flowNodeId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)

    const routerEvent: EventAiAgentRouter = {
      action: EventAction.AiAgentRouter,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId: this.name,
      flowNodeIsMeaningful: true,
      memoryLength: this.aiAgentResponse?.memoryLength ?? 0,
      inputMessageId: botContext.input.message_id!,
      exit: this.aiAgentResponse?.exit ?? true,
      error: this.aiAgentResponse?.error ?? false,
      inputGuardrailsTriggered:
        this.aiAgentResponse?.inputGuardrailsTriggered ?? [],
      outputGuardrailsTriggered:
        this.aiAgentResponse?.outputGuardrailsTriggered ?? [],
      startingAgentName: this.aiAgentResponse?.startingAgentName ?? this.name,
      lastAgentName: this.aiAgentResponse?.lastAgentName ?? this.name,
      availableSpecialists: this.aiAgentResponse?.availableSpecialists ?? [],
      isTransferredToSpecialist,
    }
    const { action, ...routerEventArgs } = routerEvent
    await trackEvent(botContext, action, routerEventArgs)
  }

  private async trackAIAgentSpecialistEvent(botContext: BotContext) {
    const { flowThreadId, flowId, flowName, flowNodeId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)

    const specialistEvent: EventAiAgent = {
      action: EventAction.AiAgent,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId: this.aiAgentResponse?.lastAgentName ?? '',
      flowNodeIsMeaningful: true,
      toolsExecuted: this.aiAgentResponse?.toolsExecuted ?? [],
      memoryLength: this.aiAgentResponse?.memoryLength ?? 0,
      inputMessageId: botContext.input.message_id!,
      exit: this.aiAgentResponse?.exit ?? true,
      error: this.aiAgentResponse?.error ?? false,
      inputGuardrailsTriggered: [],
      outputGuardrailsTriggered:
        this.aiAgentResponse?.outputGuardrailsTriggered ?? [],
    }
    const { action, ...specialistEventArgs } = specialistEvent
    await trackEvent(botContext, action, specialistEventArgs)
  }
}
