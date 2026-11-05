import type { BotContext } from '@botonic/core'
import type { MCPServer } from '@openai/agents'

/**
 * OAuth2 client_credentials configuration for an MCP server.
 * The access token is cached at module level (see `oauth-token-provider`)
 * so warm Lambda invocations reuse it until it is about to expire.
 */
export interface McpOAuthClientCredentials {
  tokenUrl: string
  clientId: string
  clientSecret: string
  scope?: string
  /** Refresh the token this many seconds before it expires (default 60). */
  refreshSkewSeconds?: number
}

export type McpToolCallPhase = 'start' | 'success' | 'error'

/**
 * Event emitted by a tracked MCP server around every tool call.
 * The bot attaches a hook (`McpServerDefinition.onToolCallEvent`) that turns
 * this into a Hubtype custom analytics event.
 */
export interface McpToolCallEvent {
  serverName: string
  toolName: string
  args: Record<string, unknown>
  phase: McpToolCallPhase
  durationMs?: number
  isError?: boolean
  errorMessage?: string
  /** Truncated textual preview of the tool result, for troubleshooting. */
  resultPreview?: string
  /** Business ids extracted from the result when present. */
  cartId?: string
  offerId?: string
  inferenceId: string
  agentName: string
}

/**
 * Declarative definition of an MCP server. The plugin turns it into a
 * `TrackedMcpServer` (a subclass of `MCPServerStreamableHttp`) that injects
 * OAuth2 bearer auth, filters the exposed tools and emits tracking events.
 */
export interface McpServerDefinition {
  /** Logical id used in logs and tracking events. */
  name: string
  url: string
  /** Allow-list of tool names; when set, every other tool is hidden. */
  allowedTools?: string[]
  /** Block-list of tool names. */
  excludedTools?: string[]
  auth?: McpOAuthClientCredentials
  /** Extra static headers sent on every MCP request. */
  headers?: Record<string, string>
  /** Per-request timeout in ms (default 10000). */
  timeout?: number
  /** Cache `tools/list` in the client (default true). */
  cacheToolsList?: boolean
  /**
   * Reuse the underlying connection across Lambda invocations via a
   * module-level singleton keyed by `name|url` (default true). When false a
   * fresh server is created (and closed) per inference.
   */
  reuseConnection?: boolean
  /** Hook invoked around every tool call for custom tracking. */
  onToolCallEvent?: (
    event: McpToolCallEvent,
    botContext: BotContext
  ) => Promise<void> | void
  /** Number of characters of the result passed to `resultPreview` (default 2000). */
  resultPreviewLength?: number
}

/**
 * Either a declarative `McpServerDefinition` (resolved by the plugin) or an
 * already-built `MCPServer` instance (passed through untouched).
 */
export type McpServerOption = McpServerDefinition | MCPServer
