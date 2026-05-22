import type {
  OutputMessage,
  ResolvedPlugins,
  ToolExecution,
} from '@botonic/core'
import { InputGuardrailTripwireTriggered, Runner } from '@openai/agents'

import { isProd } from '../constants'
import type { DebugLogger } from '../debug-logger'
import type { LLMConfig } from '../llm-config'
import { HubtypeApiClient } from '../services/hubtype-api-client'
import { TrackFeature, TrackProductName } from '../services/types'
import type {
  AgenticInputMessage,
  AgenticOutputMessage,
  AIAgent,
  Context,
  ResultRawResponse,
  RunResult,
} from '../types'

// Minimal interface matching the properties we actually use from Runner.run() result.
// This bypasses strict type checking while maintaining type safety for accessed properties.
export interface RunnerResult {
  finalOutput?: {
    messages?: OutputMessage[]
  }
  rawResponses?: ResultRawResponse[]
  newItems?: unknown[]
  // biome-ignore lint/suspicious/noExplicitAny: state is a complex internal type
  state?: any
}

export abstract class BaseRunner<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> {
  protected agent: AIAgent<TPlugins, TExtraData>
  protected llmConfig: LLMConfig
  protected inferenceId: string
  protected logger: DebugLogger

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
    const startTime = Date.now()

    this.logger.logRunnerStart(
      this.llmConfig.modelName,
      this.llmConfig.modelSettings
    )

    try {
      const runner = new Runner({
        tracingDisabled: true,
      })
      const result = (await runner.run(this.agent, messages, {
        context,
      })) as RunnerResult
      const endTime = Date.now()

      await this.sendLlmRunTracking(result, context, startTime, endTime)

      const runResult = this.buildRunResult(result, context, messages.length)

      this.logger.logRunResult(runResult, startTime)

      return runResult
    } catch (error) {
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
        this.logger.logRunResult(runResult, startTime)

        return runResult
      }

      this.logger.logRunnerError(startTime, error)

      throw error
    }
  }

  protected getToolsExecuted(
    _result: RunnerResult,
    _context: Context<TPlugins, TExtraData>
  ): ToolExecution[] {
    return []
  }

  private buildRunResult(
    result: RunnerResult,
    context: Context<TPlugins, TExtraData>,
    memoryLength: number
  ): RunResult {
    const outputMessages = result.finalOutput?.messages || []
    const hasExit =
      outputMessages.length === 0 ||
      outputMessages.some(message => message.type === 'exit')

    return {
      messages: hasExit
        ? []
        : (outputMessages.filter(
            message => message.type !== 'exit'
          ) as AgenticOutputMessage[]),
      toolsExecuted: this.getToolsExecuted(result, context),
      exit: hasExit,
      memoryLength,
      error: false,
      inputGuardrailsTriggered: [],
      outputGuardrailsTriggered: [],
    }
  }

  private async sendLlmRunTracking(
    result: RunnerResult,
    context: Context<TPlugins, TExtraData>,
    startTime: number,
    endTime: number
  ): Promise<void> {
    if (!isProd) {
      return
    }
    const rawResponses = result.rawResponses ?? []
    if (rawResponses.length === 0) {
      return
    }
    const botId = context.request.session.bot.id
    const isTest = context.request.session.is_test_integration
    const totalDuration = endTime - startTime
    const durationPerCall = Math.round(totalDuration / rawResponses.length)
    const temperature =
      (this.llmConfig.modelSettings.temperature as number | undefined) ?? 0

    const llmRuns = rawResponses.map(response => ({
      inference_id: this.inferenceId,
      is_test: isTest,
      product_name: TrackProductName.AI_AGENT,
      deployment_name: this.llmConfig.modelName,
      model_name:
        (response.providerData?.model as string | undefined) ??
        this.llmConfig.modelName,
      feature: TrackFeature.AI_AGENT_RUN,
      api_version: this.llmConfig.getApiVersion(),
      num_prompt_tokens: response.usage.inputTokens,
      num_completion_tokens: response.usage.outputTokens,
      duration_in_milliseconds: durationPerCall,
      temperature,
      error: null,
    }))

    const client = new HubtypeApiClient(context.authToken)
    await client.trackLlmRuns(botId, {
      llm_runs: llmRuns,
    })
  }
}
