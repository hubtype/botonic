import {
  type AgenticOutputMessage,
  AiAgentType,
  type BotContext,
  type GuardrailRule,
  type HubtypeAssistantMessage,
  type InferenceResponse,
  VerbosityLevel,
} from '@botonic/core'
import type { FlowBuilderApi } from '../api'
import {
  type FlowBuilderContentMessage,
  FlowBuilderContentSchema,
} from '../structured-output/flow-builder-content'
import { getCommonFlowContentEventArgsForContentId } from '../tracking'
import { HubtypeAssistantContent } from '../utils/ai-agent'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'
import { ContentFieldsBase } from './content-fields-base'
import { FlowAiAgent } from './flow-ai-agent'
import type {
  HtAiAgentNode,
  HtAiAgentRouterNode,
  HtInputGuardrailRule,
  HtNodeWithContent,
} from './hubtype-fields'
import { FlowCarousel, type FlowContent, FlowText } from './index'

export interface AiAgentWithNameAndDescription {
  agent: FlowAiAgent
  description: string
  name: string
}

export class FlowAiAgentRouter extends ContentFieldsBase {
  public name: string = ''
  public instructions: string = ''
  public model: string = ''
  public verbosity: VerbosityLevel = VerbosityLevel.Medium
  public agents: AiAgentWithNameAndDescription[] = []
  public inputGuardrailRules: HtInputGuardrailRule[] = []

  public aiAgentResponse?: InferenceResponse<FlowBuilderContentMessage>
  public messages: AgenticOutputMessage<FlowBuilderContentMessage>[] = []
  public jsxElements: JSX.Element[] = []

  static fromHubtypeCMS(
    component: HtAiAgentRouterNode,
    cmsApi: FlowBuilderApi
  ): FlowAiAgentRouter {
    const newAiAgentRouter = new FlowAiAgentRouter(component.id)
    newAiAgentRouter.name = component.code
    newAiAgentRouter.instructions = component.content.instructions
    newAiAgentRouter.model = component.content.model
    newAiAgentRouter.verbosity = component.content.verbosity
    newAiAgentRouter.agents = component.content.agent_slots.map(agentSlot => {
      const agentNode = cmsApi.getNodeById<HtAiAgentNode>(agentSlot.target.id)
      const aiAgent = FlowAiAgent.fromHubtypeCMS(agentNode)
      return {
        agent: aiAgent,
        description: agentSlot.description || '',
        name: agentSlot.name || '',
      }
    })
    newAiAgentRouter.inputGuardrailRules =
      component.content.input_guardrail_rules || []
    return newAiAgentRouter
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
        previousHubtypeMessages: previousHubtypeContents,
      }
    )

    console.log('FlowAiAgentRouter aiAgentResponse', {
      aiAgentResponse,
    })

    return aiAgentResponse
  }

  async trackFlow(_botContext: BotContext): Promise<void> {
    return
  }

  async trackAiAgentResponse(botContext: BotContext) {
    const { flowThreadId, flowId, flowName, flowNodeId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)

    // TODO: Create a new endpoint for AIAgentRouter
    const event = {
      action: 'AIAgentRouter',
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
    }

    const { action, ...eventArgs } = event

    console.log('trackAiAgentResponse', {
      action,
      eventArgs,
    })
    // await trackEvent(botContext, action, eventArgs)
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

  private getActiveInputGuardrailRules(
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

  async processContent(
    botContext: BotContext,
    previousContents?: FlowContent[]
  ): Promise<void> {
    if (this.messages.length === 0) {
      await this.resolveAIAgentResponse(botContext, previousContents)
    }
    if (this.jsxElements.length === 0) {
      await this.filterContent(botContext, this)
      await this.messagesToBotonicJSXElements(botContext)
    }
    return
  }

  toBotonic(): JSX.Element {
    return <>{this.jsxElements}</>
  }
}
