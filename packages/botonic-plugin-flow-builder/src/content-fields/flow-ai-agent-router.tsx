import {
  AiAgentType,
  type BotContext,
  EventAction,
  type InferenceResponse,
} from '@botonic/core'
import type { FlowBuilderApi } from '../api'
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

export interface AiAgentWithNameAndDescription {
  agent: FlowAiAgent
  description: string
  name: string
}

export class FlowAiAgentRouter extends FlowAiAgentBase {
  public agents: AiAgentWithNameAndDescription[] = []

  static fromHubtypeCMS(
    component: HtAiAgentRouterNode,
    cmsApi: FlowBuilderApi
  ): FlowAiAgentRouter {
    const newAiAgentRouter = new FlowAiAgentRouter(component.id)
    newAiAgentRouter.code = component.code
    newAiAgentRouter.name = component.content.name
    newAiAgentRouter.instructions = component.content.instructions
    newAiAgentRouter.model = component.content.model
    newAiAgentRouter.verbosity = component.content.verbosity
    newAiAgentRouter.agents = FlowAiAgentRouter.getTransferAgentsFromHubtypeCMS(
      component,
      cmsApi
    )
    newAiAgentRouter.inputGuardrailRules =
      component.content.input_guardrail_rules || []
    return newAiAgentRouter
  }

  private static getTransferAgentsFromHubtypeCMS(
    component: HtAiAgentRouterNode,
    cmsApi: FlowBuilderApi
  ): AiAgentWithNameAndDescription[] {
    return component.content.agent_slots.map((agentSlot, index) => {
      const agentNode = cmsApi.getNodeById<HtAiAgentNode>(agentSlot.target.id)
      const aiAgent = FlowAiAgent.fromHubtypeCMS(agentNode)
      const aiAgentName = FlowAiAgentRouter.transferAgentSlotBaseName(
        agentSlot.name,
        index
      )
      const agentDescription =
        agentSlot.description || `Transfer to ${aiAgentName}`

      return {
        agent: aiAgent,
        description: agentDescription,
        name: `transfer_to_${aiAgentName}`,
      }
    })
  }

  private static transferAgentSlotBaseName(
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
        agents: this.agents.map(({ agent, description, name }) => ({
          type: AiAgentType.Worker,
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
        })),
        inputGuardrailRules: this.getActiveInputGuardrailRules(
          this.inputGuardrailRules
        ),
        outputMessagesSchemas: [FlowBuilderContentSchema],
        previousHubtypeMessages:
          this.getPreviousHubtypeContents(previousContents),
      }
    )

    console.log('FlowAiAgentRouter aiAgentResponse', {
      aiAgentResponse,
    })

    return aiAgentResponse
  }

  async trackAiAgentResponse(botContext: BotContext) {
    const { flowThreadId, flowId, flowName, flowNodeId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)

    const action = EventAction.AiAgentRouter
    const eventArgs = {
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId: this.name,
      flowNodeIsMeaningful: true,
      toolsExecuted: this.aiAgentResponse?.toolsExecuted ?? [],
      memoryLength: this.aiAgentResponse?.memoryLength ?? 0,
      inputMessageId: botContext.input.message_id!,
      exit: this.aiAgentResponse?.exit ?? true,
      inputGuardrailsTriggered:
        this.aiAgentResponse?.inputGuardrailsTriggered ?? [],
      outputGuardrailsTriggered: [],
    }

    await trackEvent(botContext, action, eventArgs)
  }
}
