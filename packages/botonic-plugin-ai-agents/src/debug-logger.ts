import type { AiAgentArgs, ToolExecution } from '@botonic/core'

import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  MAX_MEMORY_LENGTH,
  OPENAI_MODEL,
  OPENAI_PROVIDER,
} from './constants'
import type { AgenticInputMessage, MemoryOptions, RunResult } from './types'

const PREFIX = '[BotonicPluginAiAgents]'

export interface DebugLoggerConfig {
  messageHistoryApiVersion: string
  maxRetries: number
  timeout: number
  customToolNames: string[]
  memory: MemoryOptions
}

export interface ModelSettingsInfo {
  provider: string
  model: string | undefined
  reasoning?: { effort: string }
  text?: { verbosity: string }
  toolChoice?: string
  hasRetrieveKnowledge: boolean
}

export interface DebugLogger {
  logInitialConfig(config: DebugLoggerConfig): void
  logAgentDebugInfo(
    aiAgentArgs: AiAgentArgs,
    toolNames: string[],
    messages: AgenticInputMessage[]
  ): void
  logModelSettings(settings: ModelSettingsInfo): void
  logRunnerStart(): void
  logRunResult(runResult: RunResult, startTime: number): void
  logGuardrailTriggered(): void
  logRunnerError(startTime: number, error: unknown): void
  logToolExecution(toolExecution: ToolExecution): void
}

class EnabledDebugLogger implements DebugLogger {
  private getModelInfo(): { model: string; apiBase: string } {
    const model =
      OPENAI_PROVIDER === 'azure'
        ? AZURE_OPENAI_API_DEPLOYMENT_NAME
        : OPENAI_MODEL
    const apiBase =
      OPENAI_PROVIDER === 'azure' && AZURE_OPENAI_API_BASE
        ? AZURE_OPENAI_API_BASE
        : 'OpenAI API'
    return { model, apiBase }
  }

  logInitialConfig(config: DebugLoggerConfig): void {
    const { model, apiBase } = this.getModelInfo()

    console.log(`${PREFIX} === Plugin Initialization ===`)
    console.log(`${PREFIX} Provider: ${OPENAI_PROVIDER}`)
    console.log(`${PREFIX} Model/Deployment: ${model}`)
    console.log(`${PREFIX} API Base: ${apiBase}`)
    console.log(
      `${PREFIX} Message History API Version: ${config.messageHistoryApiVersion}`
    )
    console.log(`${PREFIX} Max Retries: ${config.maxRetries}`)
    console.log(`${PREFIX} Timeout: ${config.timeout}ms`)
    console.log(
      `${PREFIX} Custom Tools Registered: ${config.customToolNames.join(', ') || 'none'}`
    )
    console.log(`${PREFIX} Memory Options:`, {
      maxMessages: config.memory.maxMessages ?? MAX_MEMORY_LENGTH,
      includeToolCalls: config.memory.includeToolCalls ?? true,
      maxFullToolResults: config.memory.maxFullToolResults ?? 1,
      debugMode: config.memory.debugMode ?? false,
    })
    console.log(`${PREFIX} === End Plugin Initialization ===`)
  }

  logAgentDebugInfo(
    aiAgentArgs: AiAgentArgs,
    toolNames: string[],
    messages: AgenticInputMessage[]
  ): void {
    console.log(`${PREFIX} === AI Agent Debug Info ===`)
    console.log(`${PREFIX} Agent Name: ${aiAgentArgs.name}`)
    console.log(`${PREFIX} Active Tools: ${JSON.stringify(toolNames)}`)
    console.log(
      `${PREFIX} Source IDs: ${JSON.stringify(aiAgentArgs.sourceIds || [])}`
    )
    console.log(`${PREFIX} Message History Count: ${messages.length}`)
    console.log(
      `${PREFIX} Input Guardrail Rules: ${aiAgentArgs.inputGuardrailRules?.length || 0}`
    )
    console.log(`${PREFIX} Instructions:`)
    console.log(aiAgentArgs.instructions)
    console.log(`${PREFIX} === End Debug Info ===`)
  }

  logModelSettings(settings: ModelSettingsInfo): void {
    console.log(`${PREFIX} === Agent Model Settings ===`)
    console.log(
      `${PREFIX} Has Retrieve Knowledge Tool: ${settings.hasRetrieveKnowledge}`
    )
    if (settings.reasoning) {
      console.log(`${PREFIX} Reasoning Effort: ${settings.reasoning.effort}`)
    }
    if (settings.text) {
      console.log(`${PREFIX} Text Verbosity: ${settings.text.verbosity}`)
    }
    if (settings.toolChoice) {
      console.log(`${PREFIX} Tool Choice: ${settings.toolChoice}`)
    }
    console.log(`${PREFIX} === End Model Settings ===`)
  }

  logRunnerStart(): void {
    console.log(`${PREFIX} === Runner Execution Start ===`)
  }

  logRunResult(runResult: RunResult, startTime: number): void {
    const elapsedMs = Date.now() - startTime

    console.log(`${PREFIX} === Runner Execution Complete ===`)
    console.log(`${PREFIX} Execution Time: ${elapsedMs}ms`)
    console.log(`${PREFIX} Output Messages Count: ${runResult.messages.length}`)
    console.log(`${PREFIX} Exit: ${runResult.exit}`)
    console.log(`${PREFIX} Error: ${runResult.error}`)
    console.log(
      `${PREFIX} Tools Executed: ${JSON.stringify(runResult.toolsExecuted.map(t => t.toolName))}`
    )
    if (runResult.inputGuardrailsTriggered.length > 0) {
      console.log(
        `${PREFIX} Input Guardrails Triggered: ${runResult.inputGuardrailsTriggered.length}`
      )
    }
    if (runResult.outputGuardrailsTriggered.length > 0) {
      console.log(
        `${PREFIX} Output Guardrails Triggered: ${runResult.outputGuardrailsTriggered.length}`
      )
    }
    console.log(`${PREFIX} === End Runner Execution ===`)
  }

  logGuardrailTriggered(): void {
    console.log(`${PREFIX} Input guardrail triggered`)
  }

  logRunnerError(startTime: number, error: unknown): void {
    const elapsedMs = Date.now() - startTime
    console.log(`${PREFIX} Runner execution failed after ${elapsedMs}ms`)
    console.log(`${PREFIX} Error:`, error)
  }

  logToolExecution(toolExecution: ToolExecution): void {
    console.log(`${PREFIX} Tool Execution: ${toolExecution.toolName}`)
    console.log(
      `${PREFIX} Tool Arguments: ${JSON.stringify(toolExecution.toolArguments)}`
    )
    console.log(`${PREFIX} Tool Results: ${toolExecution.toolResults}`)
    console.log(
      `${PREFIX} Knowledgebase Sources IDs: ${JSON.stringify(toolExecution.knowledgebaseSourcesIds)}`
    )
    console.log(
      `${PREFIX} Knowledgebase Chunks IDs: ${JSON.stringify(toolExecution.knowledgebaseChunksIds)}`
    )
  }
}

class DisabledDebugLogger implements DebugLogger {
  logInitialConfig(): void {}
  logAgentDebugInfo(): void {}
  logModelSettings(): void {}
  logRunnerStart(): void {}
  logRunResult(): void {}
  logGuardrailTriggered(): void {}
  logRunnerError(): void {}
  logToolExecution(): void {}
}

export function createDebugLogger(enableDebug: boolean): DebugLogger {
  return enableDebug ? new EnabledDebugLogger() : new DisabledDebugLogger()
}
