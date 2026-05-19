import type { ResolvedPlugins } from '@botonic/core'
import { Agent, type AgentOutputType, type Handoff } from '@openai/agents'
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions'
import type { z } from 'zod'
import type { GuardrailTrackingContext } from '../guardrails/input'
import type { LLMConfig } from '../llm-config'
import type { OutputSchema } from '../structured-output'
import type { AIAgent, Context, GuardrailRule } from '../types'
import { BaseAgent } from './base-agent'

interface RouterAgentOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> {
  name: string
  instructions: string
  llmConfig: LLMConfig
  handoffs: Handoff<
    Context<TPlugins, TExtraData>,
    AgentOutputType<typeof OutputSchema>
  >[]
  inputGuardrailRules: GuardrailRule[]
  outputMessagesSchemas?: z.ZodObject[]
  guardrailTrackingContext: GuardrailTrackingContext
}

export class RouterAgent<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> extends BaseAgent {
  private handoffs: Handoff<
    Context<TPlugins, TExtraData>,
    AgentOutputType<typeof OutputSchema>
  >[]
  private agent!: AIAgent<TPlugins, TExtraData>

  private constructor(options: RouterAgentOptions<TPlugins, TExtraData>) {
    super(options)
    this.handoffs = options.handoffs
  }

  static async create<
    TPlugins extends ResolvedPlugins = ResolvedPlugins,
    TExtraData = unknown,
  >(
    options: RouterAgentOptions<TPlugins, TExtraData>
  ): Promise<RouterAgent<TPlugins, TExtraData>> {
    const routerAgent = new RouterAgent<TPlugins, TExtraData>(options)
    const inputGuardrails = await routerAgent.getInputGuardrails()

    // Agent.create is typed as Agent<UnknownContext>; we run with Context<TPlugins, TExtraData>.
    const agent = Agent.create({
      name: routerAgent.name,
      model: await routerAgent.getModel(),
      modelSettings: routerAgent.getAgentModelSettings(),
      instructions: routerAgent.addOutputInstructions(
        `${RECOMMENDED_PROMPT_PREFIX}${routerAgent.instructions}`
      ),
      handoffs: routerAgent.handoffs,
      outputType: routerAgent.getOutputType(),
      inputGuardrails,
    }) as AIAgent<TPlugins, TExtraData>

    routerAgent.agent = agent
    return routerAgent
  }

  getAgent(): AIAgent<TPlugins, TExtraData> {
    return this.agent
  }
}
