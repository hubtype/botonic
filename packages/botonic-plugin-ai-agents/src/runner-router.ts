import type { AgenticOutputMessage, ResolvedPlugins } from '@botonic/core'
import { InputGuardrailTripwireTriggered, Runner } from '@openai/agents'
import type { DebugLogger } from './debug-logger'
import type { LLMConfig } from './llm-config'
import type { AIAgentRunnerResult } from './runner'
import type { AgenticInputMessage, AIAgent, Context, RunResult } from './types'

export class AIAgentRouterRunner<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  private agent: AIAgent<TPlugins, TExtraData>
  private llmConfig: LLMConfig
  private inferenceId: string
  private logger: DebugLogger

  constructor(
    agent: AIAgent<TPlugins, TExtraData>,
    llmConfig: LLMConfig,
    inferenceId: string,
    logger: DebugLogger
  ) {
    this.agent = agent
    this.llmConfig = llmConfig
    this.inferenceId = inferenceId
    this.logger = logger
  }

  async run(
    messages: AgenticInputMessage[],
    context: Context<TPlugins, TExtraData>
  ): Promise<RunResult> {
    try {
      const modelProvider = this.llmConfig.modelProvider
      const modelSettings = this.llmConfig.modelSettings

      const runner = new Runner({
        modelSettings,
        modelProvider,
        tracingDisabled: true,
      })
      const result = (await runner.run(this.agent, messages, {
        context,
      })) as AIAgentRunnerResult

      console.log('AIAgentRouterRunner result', result)
      console.log('currentAgent: ', result.state?._currentAgent?.name)
      const outputMessages = result.finalOutput?.messages || []
      const hasExit =
        outputMessages.length === 0 ||
        outputMessages.some(message => message.type === 'exit')

      const runResult: RunResult = {
        messages: hasExit
          ? []
          : (outputMessages.filter(
              message => message.type !== 'exit'
            ) as AgenticOutputMessage[]),
        toolsExecuted: [],
        exit: hasExit,
        memoryLength: messages.length,
        error: false,
        inputGuardrailsTriggered: [],
        outputGuardrailsTriggered: [],
      }

      return runResult
    } catch (error) {
      console.error('AIAgentRouterRunner error', error)
      if (error instanceof InputGuardrailTripwireTriggered) {
        const runResult: RunResult = {
          messages: [],
          memoryLength: 0,
          toolsExecuted: [],
          exit: true,
          error: false,
          inputGuardrailsTriggered: error.result.output.outputInfo,
          outputGuardrailsTriggered: [],
        }

        this.logger.logGuardrailTriggered()

        return runResult
      }

      throw error
    }
  }
}
