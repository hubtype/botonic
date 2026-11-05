import {
  type AiAgentArgs,
  AiAgentType,
  type ToolExecution,
} from '@botonic/core'
import type { ModelSettings } from '@openai/agents'
import { LLM_PROVIDER } from './constants'
import type { McpServerSummary, McpToolCallEvent } from './mcp'
import type { AgenticInputMessage, MemoryOptions, RunResult } from './types'

const PREFIX = '[BotonicPluginAiAgents]'

export interface DebugLoggerConfig {
  messageHistoryApiVersion: string
  maxRetries: number
  timeout: number
  customToolNames: string[]
  mcpServerNames?: string[]
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
  logRunnerStart(
    model: string,
    modelSettings: ModelSettings,
    prompt: string
  ): void
  logRunResult(runResult: RunResult, startTime: number): void
  logGuardrailTriggered(): void
  logRunnerError(startTime: number, error: unknown): void
  logToolExecution(toolExecution: ToolExecution): void
  logMcpServers(servers: McpServerSummary[]): void
  logMcpToolCall(event: McpToolCallEvent): void
}

class EnabledDebugLogger implements DebugLogger {
  logInitialConfig(config: DebugLoggerConfig): void {
    console.log(`${PREFIX} === Plugin Initialization ===`)
    console.log(`${PREFIX} Provider: ${LLM_PROVIDER}`)
    console.log(
      `${PREFIX} Message History API Version: ${config.messageHistoryApiVersion}`
    )
    console.log(`${PREFIX} Max Retries: ${config.maxRetries}`)
    console.log(`${PREFIX} Timeout: ${config.timeout}ms`)
    console.log(
      `${PREFIX} Custom Tools Registered: ${config.customToolNames.join(', ') || 'none'}`
    )
    if (config.mcpServerNames) {
      console.log(
        `${PREFIX} MCP Servers: ${config.mcpServerNames.join(', ') || 'none'}`
      )
    }
    console.log(`${PREFIX} Memory Options:`, {
      maxMessages: config.memory.maxMessages,
      includeToolCalls: config.memory.includeToolCalls,
      maxFullToolResults: config.memory.maxFullToolResults,
      debugMode: config.memory.debugMode,
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
    if (aiAgentArgs.type === AiAgentType.Specialist) {
      console.log(
        `${PREFIX} Source IDs: ${JSON.stringify(aiAgentArgs.sourceIds || [])}`
      )
    }
    console.log(`${PREFIX} Message History Count: ${messages.length}`)
    console.log(`${PREFIX} Messages: ${JSON.stringify(messages, null, 2)}`)
    console.log(
      `${PREFIX} Input Guardrail Rules: ${aiAgentArgs.inputGuardrailRules?.length || 0}`
    )
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

  logRunnerStart(
    model: string,
    modelSettings: ModelSettings,
    prompt: string
  ): void {
    console.log(`${PREFIX} === Runner Execution Start ===`)
    console.log(`${PREFIX} Model: ${model}`)
    console.log(`${PREFIX} Model Settings: ${JSON.stringify(modelSettings)}`)
    console.log(`${PREFIX} Prompt: ${prompt}`)
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

  logMcpServers(servers: McpServerSummary[]): void {
    console.log(`${PREFIX} === MCP Servers ===`)
    for (const server of servers) {
      const tools = server.allowedTools?.length
        ? `${server.allowedTools.join(', ')} (allowed)`
        : server.excludedTools?.length
          ? `${server.excludedTools.join(', ')} (excluded)`
          : 'all'
      console.log(`${PREFIX} MCP Server: ${server.name} (${server.url})`)
      console.log(`${PREFIX} MCP Tools: ${tools}`)
    }
    console.log(`${PREFIX} === End MCP Servers ===`)
  }

  logMcpToolCall(event: McpToolCallEvent): void {
    console.log(
      `${PREFIX} MCP Tool Call: ${event.serverName}/${event.toolName} [${event.phase}] ${event.durationMs}ms${event.isError ? ` (error: ${event.errorMessage})` : ''}`
    )
    console.log(
      `${PREFIX} Inference: ${event.inferenceId} | Agent: ${event.agentName}`
    )
    if (event.args && Object.keys(event.args).length > 0) {
      console.log(`${PREFIX} Args: ${JSON.stringify(event.args)}`)
    }
    if (event.isError) {
      console.log(`${PREFIX} Error: ${event.errorMessage}`)
      return
    }
    if (event.cartId) {
      console.log(`${PREFIX} Cart ID: ${event.cartId}`)
    }
    if (event.offerId) {
      console.log(`${PREFIX} Offer ID: ${event.offerId}`)
    }
    if (event.resultPreview) {
      console.log(`${PREFIX} Result Preview: ${event.resultPreview}`)
    }
  }
}

class DisabledDebugLogger implements DebugLogger {
  logInitialConfig(): void {
    return
  }
  logAgentDebugInfo(): void {
    return
  }
  logModelSettings(): void {
    return
  }
  logRunnerStart(
    _model: string,
    _modelSettings: ModelSettings,
    _prompt: string
  ): void {
    return
  }
  logRunResult(): void {
    return
  }
  logGuardrailTriggered(): void {
    return
  }
  logRunnerError(): void {
    return
  }
  logToolExecution(): void {
    return
  }
  logMcpServers(): void {
    return
  }
  logMcpToolCall(): void {
    return
  }
}

export function createDebugLogger(enableDebug: boolean): DebugLogger {
  return enableDebug ? new EnabledDebugLogger() : new DisabledDebugLogger()
}
