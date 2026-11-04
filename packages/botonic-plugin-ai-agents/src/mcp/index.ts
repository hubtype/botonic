import type {
  MCPServer,
  MCPServerStreamableHttp,
  MCPToolFilterStatic,
} from '@openai/agents'
import type { DebugLogger } from '../debug-logger'
import { createAuthenticatedFetch } from './authenticated-fetch'
import { TrackedMcpServer } from './tracked-mcp-server'
import type { McpServerDefinition, McpServerOption } from './types'

export { TrackedMcpServer } from './tracked-mcp-server'
export * from './types'

const DEFAULT_TIMEOUT_MS = 10_000

export interface McpServerSummary {
  name: string
  url: string
  allowedTools?: string[]
  excludedTools?: string[]
}

// Module-level singleton of connected servers, keyed by `name|url`.
// Warm Lambda invocations reuse the same `initialize` + `tools/list` round-trip.
const serverInstances = new Map<string, MCPServer>()

export function isMcpServerInstance(opt: McpServerOption): opt is MCPServer {
  return typeof (opt as MCPServer).connect === 'function'
}

function serverKey(def: McpServerDefinition): string {
  return `${def.name}|${def.url}`
}

function buildToolFilter(
  def: McpServerDefinition
): MCPToolFilterStatic | undefined {
  if (!def.allowedTools?.length && !def.excludedTools?.length) {
    return undefined
  }
  return {
    allowedToolNames: def.allowedTools,
    blockedToolNames: def.excludedTools,
  }
}

function createTrackedServer(
  def: McpServerDefinition,
  logger?: DebugLogger
): TrackedMcpServer {
  const streamableHttpOptions: ConstructorParameters<
    typeof MCPServerStreamableHttp
  >[0] = {
    url: def.url,
    name: def.name,
    cacheToolsList: def.cacheToolsList ?? true,
    timeout: def.timeout ?? DEFAULT_TIMEOUT_MS,
    toolFilter: buildToolFilter(def),
  }

  if (def.auth) {
    // The custom fetch injects the OAuth2 bearer (and any extra headers) and
    // retries once on 401/403, so we don't need the SDK's OAuthClientProvider.
    streamableHttpOptions.fetch = createAuthenticatedFetch(
      def.auth,
      def.headers
    )
  } else if (def.headers) {
    streamableHttpOptions.requestInit = { headers: def.headers }
  }

  return new TrackedMcpServer({
    streamableHttpOptions,
    onToolCallEvent: def.onToolCallEvent,
    resultPreviewLength: def.resultPreviewLength,
    reuseConnection: def.reuseConnection ?? true,
    logger,
  })
}

async function getOrCreateServer(
  def: McpServerDefinition,
  logger?: DebugLogger
): Promise<MCPServer> {
  const reuse = def.reuseConnection !== false
  const key = serverKey(def)

  if (reuse) {
    const cached = serverInstances.get(key)
    if (cached) {
      return cached
    }
  }

  const server = createTrackedServer(def, logger)
  try {
    await server.connect()
  } catch (error) {
    if (reuse) {
      serverInstances.delete(key)
    }
    await server.close().catch(() => undefined)
    throw error
  }

  if (reuse) {
    serverInstances.set(key, server)
  }

  logger?.logMcpServers([
    {
      name: def.name,
      url: def.url,
      allowedTools: def.allowedTools,
      excludedTools: def.excludedTools,
    },
  ])

  return server
}

/**
 * Resolves the MCP server options into `MCPServer` instances. Declarative
 * `McpServerDefinition`s are turned into (connected) `TrackedMcpServer`s,
 * reusing a module-level singleton per `name|url` when `reuseConnection` is
 * true (the default). Already-built `MCPServer` instances are passed through.
 */
export async function getOrCreateMcpServers(
  definitions: McpServerOption[] | undefined,
  logger?: DebugLogger
): Promise<MCPServer[]> {
  if (!definitions || definitions.length === 0) {
    return []
  }

  const servers: MCPServer[] = []
  for (const def of definitions) {
    if (isMcpServerInstance(def)) {
      servers.push(def)
      continue
    }
    servers.push(await getOrCreateServer(def, logger))
  }
  return servers
}

/** @internal Drop the module-level singleton cache. For tests only. */
export function __resetMcpServerCache(): void {
  serverInstances.clear()
}
