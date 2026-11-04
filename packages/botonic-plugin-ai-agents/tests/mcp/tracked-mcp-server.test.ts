import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { TrackedMcpServer } from '../../src/mcp/tracked-mcp-server'
import type { McpToolCallEvent } from '../../src/mcp/types'

// `mock`-prefixed so jest.mock's factory can close over it (the access is
// deferred to callTool time, after the const is initialized).
const mockCallTool = jest.fn()

jest.mock('@openai/agents', () => {
  class MCPServerStreamableHttp {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_opts?: unknown) {}
    async callTool(name: string, args: unknown, meta?: unknown) {
      return mockCallTool(name, args, meta)
    }
  }
  return { MCPServerStreamableHttp }
})

describe('TrackedMcpServer', () => {
  beforeEach(() => {
    mockCallTool.mockReset()
  })

  function makeServer(
    hook?: (e: McpToolCallEvent) => void,
    opts?: { reuseConnection?: boolean; logger?: { logMcpToolCall: jest.Mock } }
  ) {
    const server = new TrackedMcpServer({
      streamableHttpOptions: { name: 'viva', url: 'https://mcp.viva.com' },
      onToolCallEvent: hook ? (e: McpToolCallEvent) => hook(e) : undefined,
      reuseConnection: opts?.reuseConnection,
      // biome-ignore lint/suspicious/noExplicitAny: test double
      logger: opts?.logger as any,
    })
    server.setTrackingContext({
      // biome-ignore lint/suspicious/noExplicitAny: test double
      botContext: { id: 'ctx' } as any,
      inferenceId: 'inf-1',
      agentName: 'viva-agent',
    })
    return server
  }

  it('emits start+success with duration and extracts business ids', async () => {
    const events: McpToolCallEvent[] = []
    mockCallTool.mockResolvedValue([
      { type: 'text', text: '{"cartId":"CART-123","offerId":"OFF-456"}' },
    ] as never)
    const server = makeServer(e => events.push(e))

    const result = await server.callTool('viva_search_flights', {
      from: 'MAD',
    })

    expect(result).toEqual([
      { type: 'text', text: '{"cartId":"CART-123","offerId":"OFF-456"}' },
    ])
    expect(events.map(e => e.phase)).toEqual(['start', 'success'])
    const success = events[1]
    expect(success.durationMs).toBeGreaterThanOrEqual(0)
    expect(success.cartId).toBe('CART-123')
    expect(success.offerId).toBe('OFF-456')
    expect(success.resultPreview).toContain('CART-123')
  })

  it('rethrows tool errors after emitting an error event', async () => {
    const events: McpToolCallEvent[] = []
    mockCallTool.mockRejectedValue(new Error('boom') as never)
    const server = makeServer(e => events.push(e))

    await expect(server.callTool('viva_search_flights', {})).rejects.toThrow(
      'boom'
    )

    expect(events.map(e => e.phase)).toEqual(['start', 'error'])
    expect(events[1].isError).toBe(true)
    expect(events[1].errorMessage).toBe('boom')
  })

  it('does not break the tool call when the tracking hook throws', async () => {
    mockCallTool.mockResolvedValue([{ type: 'text', text: 'ok' }] as never)
    const server = makeServer(() => {
      throw new Error('hook failed')
    })

    const result = await server.callTool('viva_search_flights', {})
    expect(result).toEqual([{ type: 'text', text: 'ok' }])
  })

  it('truncates the result preview to resultPreviewLength', async () => {
    mockCallTool.mockResolvedValue([
      { type: 'text', text: 'x'.repeat(5000) },
    ] as never)
    let captured: McpToolCallEvent | undefined
    const server = new TrackedMcpServer({
      streamableHttpOptions: { name: 'viva', url: 'https://mcp.viva.com' },
      resultPreviewLength: 10,
      onToolCallEvent: e => {
        captured = e
      },
    })
    server.setTrackingContext({
      // biome-ignore lint/suspicious/noExplicitAny: test double
      botContext: {} as any,
      inferenceId: 'i',
      agentName: 'a',
    })
    await server.callTool('t', {})
    expect(captured?.resultPreview).toHaveLength(10)
  })

  it('logs tool calls via the debug logger', async () => {
    const logMcpToolCall = jest.fn()
    mockCallTool.mockResolvedValue([{ type: 'text', text: 'ok' }] as never)
    const server = makeServer(undefined, { logger: { logMcpToolCall } })

    await server.callTool('viva_search_flights', {})

    expect(logMcpToolCall).toHaveBeenCalled()
    expect((logMcpToolCall.mock.calls[0][0] as McpToolCallEvent).toolName).toBe(
      'viva_search_flights'
    )
  })
})
