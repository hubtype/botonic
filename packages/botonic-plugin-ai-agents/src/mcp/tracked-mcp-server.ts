import type { BotContext } from '@botonic/core'
import { MCPServerStreamableHttp } from '@openai/agents'
import type { DebugLogger } from '../debug-logger'
import type { McpToolCallEvent, McpToolCallPhase } from './types'

const DEFAULT_RESULT_PREVIEW_LENGTH = 2000

export interface TrackingContext {
  botContext: BotContext
  inferenceId: string
  agentName: string
}

export type McpToolCallHook = (
  event: McpToolCallEvent,
  botContext: BotContext
) => Promise<void> | void

export interface TrackedMcpServerOptions {
  /** Standard `MCPServerStreamableHttp` constructor options. */
  // `ConstructorParameters` avoids depending on the (unexported) options type.
  streamableHttpOptions: ConstructorParameters<
    typeof MCPServerStreamableHttp
  >[0]
  onToolCallEvent?: McpToolCallHook
  resultPreviewLength?: number
  /** Whether the connection is reused across invocations (passed through). */
  reuseConnection?: boolean
  /** Optional debug logger for console tracing of tool calls. */
  logger?: DebugLogger
}

/**
 * `MCPServerStreamableHttp` subclass that emits a tracking event around every
 * `callTool` (start / success / error), measures latency, extracts business
 * ids (`cartId` / `offerId`) from the result text and produces a truncated
 * result preview. A failure inside the tracking hook never breaks the tool:
 * it is awaited inside a try/catch.
 *
 * The per-inference context (bot context, inference id, agent name) is set via
 * `setTrackingContext` by the plugin before each run, so warm/reused servers
 * still report the correct request.
 */
export class TrackedMcpServer extends MCPServerStreamableHttp {
  private trackingContext: TrackingContext | undefined
  private readonly hook: McpToolCallHook | undefined
  private readonly serverName: string
  private readonly resultPreviewLength: number
  readonly reuseConnection: boolean
  // Named `debugLogger` (not `logger`) to avoid colliding with the base
  // class' `protected logger: Logger`.
  private readonly debugLogger?: DebugLogger

  constructor(options: TrackedMcpServerOptions) {
    super(options.streamableHttpOptions)
    const streamable = options.streamableHttpOptions
    this.serverName = streamable?.name ?? streamable?.url ?? 'mcp'
    this.hook = options.onToolCallEvent
    this.resultPreviewLength =
      options.resultPreviewLength ?? DEFAULT_RESULT_PREVIEW_LENGTH
    this.reuseConnection = options.reuseConnection ?? true
    this.debugLogger = options.logger
  }

  /** Set the per-inference context used by the tracking hook. */
  setTrackingContext(ctx: TrackingContext): void {
    this.trackingContext = ctx
  }

  // No explicit return type: it is inferred from `super.callTool` as
  // `Promise<CallToolResultContent>`, which keeps the override assignable to
  // `MCPServer.callTool`. The result is returned untouched; the helpers below
  // read from it without narrowing its type.
  async callTool(
    toolName: string,
    args: Record<string, unknown> | null,
    meta?: Record<string, unknown> | null
  ) {
    const ctx = this.trackingContext
    const safeArgs = args ?? {}
    const start = Date.now()

    await this.emit('start', toolName, safeArgs, start, ctx)

    try {
      const result = await super.callTool(toolName, args, meta)
      const text = this.extractText(result)
      const { cartId, offerId } = this.extractBusinessIds(text)
      await this.emit('success', toolName, safeArgs, start, ctx, {
        resultPreview: this.truncate(text),
        cartId,
        offerId,
      })
      return result
    } catch (error) {
      await this.emit('error', toolName, safeArgs, start, ctx, {
        isError: true,
        errorMessage: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  private async emit(
    phase: McpToolCallPhase,
    toolName: string,
    args: Record<string, unknown>,
    start: number,
    ctx: TrackingContext | undefined,
    extra?: Partial<McpToolCallEvent>
  ): Promise<void> {
    if (!this.debugLogger && (!this.hook || !ctx)) {
      return
    }
    const event: McpToolCallEvent = {
      serverName: this.serverName,
      toolName,
      args,
      phase,
      durationMs: Date.now() - start,
      inferenceId: ctx?.inferenceId ?? '',
      agentName: ctx?.agentName ?? '',
      ...extra,
    }

    if (this.debugLogger) {
      try {
        this.debugLogger.logMcpToolCall(event)
      } catch {
        /* no-op */
      }
    }

    // Tracking must never break a tool call.
    if (this.hook && ctx) {
      try {
        await this.hook(event, ctx.botContext)
      } catch {
        /* no-op */
      }
    }
  }

  private extractText(result: unknown): string {
    const content = this.asContentArray(result)
    const parts = content.map(item => {
      const entry = item as
        | { text?: unknown; resource?: { text?: unknown } }
        | undefined
      if (typeof entry?.text === 'string') {
        return entry.text
      }
      if (typeof entry?.resource?.text === 'string') {
        return entry.resource.text
      }
      return ''
    })
    const text = parts.filter(Boolean).join('\n')
    return text || this.safeStringify(result)
  }

  private asContentArray(result: unknown): ReadonlyArray<unknown> {
    if (Array.isArray(result)) {
      return result as ReadonlyArray<unknown>
    }
    const content = (result as { content?: unknown })?.content
    if (Array.isArray(content)) {
      return content as ReadonlyArray<unknown>
    }
    return []
  }

  private safeStringify(value: unknown): string {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  private truncate(text: string): string {
    return text.length > this.resultPreviewLength
      ? text.slice(0, this.resultPreviewLength)
      : text
  }

  private matchFirst(text: string, pattern: RegExp): string | undefined {
    const match = text.match(pattern)
    return match?.[1]
  }

  private extractBusinessIds(text: string): {
    cartId?: string
    offerId?: string
  } {
    const cartId =
      this.matchFirst(text, /["']?cartId["']?\s*[:=]\s*["']([^"']+)["']/i) ??
      this.matchFirst(text, /["']?cart_id["']?\s*[:=]\s*["']([^"']+)["']/i)
    const offerId =
      this.matchFirst(text, /["']?offerId["']?\s*[:=]\s*["']([^"']+)["']/i) ??
      this.matchFirst(text, /["']?offer_id["']?\s*[:=]\s*["']([^"']+)["']/i)
    return { cartId, offerId }
  }
}
