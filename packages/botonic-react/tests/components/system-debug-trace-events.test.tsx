/**
 * @jest-environment jsdom
 */
import { EventAction } from '@botonic/core'
import { act, render, waitFor } from '@testing-library/react'
import type { ReactElement } from 'react'
import TestRenderer from 'react-test-renderer'

import {
  AiAgent,
  getAiAgentEventConfig,
} from '../../src/components/system-debug-trace/events/ai-agent'
import { parseTools } from '../../src/components/system-debug-trace/events/ai-agent/parse-tools'
import { clearRehydrationCacheForTests } from '../../src/components/system-debug-trace/events/ai-agent/rehydrate-ai-agent-event'
import type { AiAgentDebugEvent } from '../../src/components/system-debug-trace/events/ai-agent/types'
import {
  AiAgentRouter,
  getAiAgentRouterEventConfig,
} from '../../src/components/system-debug-trace/events/ai-agent-router/ai-agent-router'
import type { AiAgentRouterDebugEvent } from '../../src/components/system-debug-trace/events/ai-agent-router/types'
import {
  getHandoffSuccessEventConfig,
  HandoffSuccess,
  type HandoffSuccessDebugEvent,
} from '../../src/components/system-debug-trace/events/handoff-success'
import type { MinimalHubtypeMessage } from '../../src/index-types'
import { WebchatContext } from '../../src/webchat/context'
import type { WebchatContextProps } from '../../src/webchat/context/types'

const renderToJSON = (sut: ReactElement) => TestRenderer.create(sut).toJSON()

const mockWebchatContext = {
  previewUtils: {
    onClickOpenChunks: jest.fn(),
    onClickOpenToolResults: jest.fn(),
    getChunkIdsGroupedBySource: jest.fn().mockResolvedValue([]),
    getMessageById: jest.fn().mockResolvedValue({}),
    trackPreviewEventOpened: jest.fn(),
  },
  updateMessage: jest.fn(),
  webchatState: {
    messagesJSON: [],
  },
} as unknown as WebchatContextProps

const defaultHandoffProps = (
  overrides: Partial<HandoffSuccessDebugEvent> = {}
): HandoffSuccessDebugEvent => ({
  action: EventAction.HandoffSuccess,
  handoff_queue_name: 'Test Queue',
  handoff_is_queue_open: true,
  handoff_has_auto_assign: false,
  handoff_note_id: '',
  ...overrides,
})

const defaultAiAgentProps = (
  overrides: Partial<AiAgentDebugEvent> = {}
): AiAgentDebugEvent => ({
  action: EventAction.AiAgent,
  flow_node_content_id: 'content-1',
  tools_executed: [],
  input_guardrails_triggered: [],
  output_guardrails_triggered: [],
  exit: false,
  error: false,
  ...overrides,
})

const withWebchatContext = (
  overrides: {
    previewUtils?: Partial<NonNullable<WebchatContextProps['previewUtils']>>
  } = {}
): WebchatContextProps =>
  ({
    ...mockWebchatContext,
    ...overrides,
    previewUtils: overrides.previewUtils
      ? { ...mockWebchatContext.previewUtils, ...overrides.previewUtils }
      : mockWebchatContext.previewUtils,
  }) as WebchatContextProps

async function renderAiAgentInWebchat(
  props: AiAgentDebugEvent,
  context: WebchatContextProps = mockWebchatContext
): Promise<HTMLElement> {
  let container!: HTMLElement
  await act(async () => {
    container = render(
      <WebchatContext.Provider value={context}>
        <AiAgent {...props} />
      </WebchatContext.Provider>
    ).container
    await waitFor(() => undefined, { timeout: 100 })
  })
  return container
}

async function renderAiAgentRouterInWebchat(
  props: AiAgentRouterDebugEvent
): Promise<HTMLElement> {
  let container!: HTMLElement
  await act(async () => {
    container = render(
      <WebchatContext.Provider value={mockWebchatContext}>
        <AiAgentRouter {...props} />
      </WebchatContext.Provider>
    ).container
    await waitFor(() => undefined, { timeout: 100 })
  })
  return container
}

describe('System Debug Trace - Event Components', () => {
  describe('HandoffSuccess Component', () => {
    test('renders queue name correctly', () => {
      const props = defaultHandoffProps({
        handoff_queue_name: 'Premium Support',
      })

      const { container } = render(<HandoffSuccess {...props} />)

      expect(container.textContent).toContain('Premium Support')
    })

    test('displays queue label', () => {
      const props = defaultHandoffProps({
        handoff_queue_name: 'General Support',
        handoff_is_queue_open: false,
      })

      const { container } = render(<HandoffSuccess {...props} />)

      expect(container.textContent).toContain('Queue')
    })

    test('matches snapshot', () => {
      const props = defaultHandoffProps({
        handoff_queue_name: 'Test Queue',
      })

      const sut = <HandoffSuccess {...props} />
      const tree = renderToJSON(sut)
      expect(tree).toMatchSnapshot()
    })
  })

  describe('AiAgent Component', () => {
    beforeEach(() => {
      clearRehydrationCacheForTests()
    })

    test('renders without tools and displays no tools executed label', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({ user_input: 'What is the weather?' })
      )

      expect(container).toBeTruthy()
      expect(container.textContent).toContain('No tools executed')
    })

    test('renders with tools executed', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'Search for flights',
          tools_executed: [
            {
              tool_name: 'search_flights',
              tool_arguments: {
                destination: 'NYC',
                date: '2024-01-01',
              },
              tool_results: 'result1',
            },
          ],
        })
      )

      expect(container.textContent).toContain('search_flights')
    })

    test('renders with input guardrails', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'inappropriate content',
          input_guardrails_triggered: ['profanity_filter', 'pii_detection'],
        })
      )

      expect(container.textContent).toContain('profanity_filter')
      expect(container.textContent).toContain('pii_detection')
    })

    test('renders with output guardrails', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          output_guardrails_triggered: ['toxicity_check'],
        })
      )

      expect(container.textContent).toContain('toxicity_check')
    })

    test('renders with both input and output guardrails', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          input_guardrails_triggered: ['input_guard'],
          output_guardrails_triggered: ['output_guard'],
        })
      )

      expect(container.textContent).toContain('input_guard')
      expect(container.textContent).toContain('output_guard')
    })

    test('config has correct properties', () => {
      const config = getAiAgentEventConfig(
        defaultAiAgentProps({ user_input: 'test' })
      )

      expect(config.action).toBe(EventAction.AiAgent)
      expect(config.component).toBe(AiAgent)
      expect(config.collapsible).toBe(true)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('rehydrates truncated event via getMessageById', async () => {
      const getMessageById = jest.fn().mockResolvedValue({
        event_data: {
          tools_executed: [
            {
              tool_name: 'search_flights',
              tool_arguments: { destination: 'NYC' },
              tool_results: 'result1',
            },
          ],
        },
      })

      const context = withWebchatContext({
        previewUtils: { getMessageById },
      })

      const props = defaultAiAgentProps({
        truncated: true,
        hubtype_message_id: 'msg-1',
      })

      const { container } = render(
        <WebchatContext.Provider value={context}>
          <AiAgent {...props} />
        </WebchatContext.Provider>
      )

      await waitFor(() => {
        expect(container.textContent).toContain('search_flights')
      })

      expect(getMessageById).toHaveBeenCalledWith('msg-1', {
        includeDebugEvents: true,
      })
    })

    test('fetches chunks via getChunkIdsGroupedBySource after rehydration', async () => {
      const getChunkIdsGroupedBySource = jest.fn().mockResolvedValue([])
      const getMessageById = jest.fn().mockResolvedValue({
        event_data: {
          tools_executed: [
            {
              tool_name: 'retrieve_knowledge',
              tool_arguments: { query: 'return policy' },
              tool_results: 'result1',
              knowledgebase_sources_ids: ['src-1'],
              knowledgebase_chunks_ids: ['chunk-1', 'chunk-2'],
            },
          ],
        },
      })

      const context = withWebchatContext({
        previewUtils: { getMessageById, getChunkIdsGroupedBySource },
      })

      const props = defaultAiAgentProps({
        truncated: true,
        hubtype_message_id: 'msg-1',
      })

      const { container } = render(
        <WebchatContext.Provider value={context}>
          <AiAgent {...props} />
        </WebchatContext.Provider>
      )

      await waitFor(() => {
        expect(getMessageById).toHaveBeenCalledWith('msg-1', {
          includeDebugEvents: true,
        })
      })

      await waitFor(() => {
        expect(getChunkIdsGroupedBySource).toHaveBeenCalledWith([
          'chunk-1',
          'chunk-2',
        ])
      })

      expect(container).toBeTruthy()
    })

    test('does not fetch when event is not truncated', async () => {
      const getMessageById = jest.fn()
      const context = withWebchatContext({
        previewUtils: { getMessageById },
      })

      await act(async () => {
        render(
          <WebchatContext.Provider value={context}>
            <AiAgent {...defaultAiAgentProps()} />
          </WebchatContext.Provider>
        )
        await waitFor(() => undefined, { timeout: 100 })
      })

      expect(getMessageById).not.toHaveBeenCalled()
    })

    test('does not show no tools executed while rehydrating', async () => {
      let resolvePromise!: (value: MinimalHubtypeMessage) => void
      const getMessageById = jest.fn(
        (): Promise<MinimalHubtypeMessage> =>
          new Promise(resolve => {
            resolvePromise = resolve
          })
      )

      const context = withWebchatContext({
        previewUtils: { getMessageById },
      })

      const props = defaultAiAgentProps({
        truncated: true,
        hubtype_message_id: 'msg-1',
      })

      const { container } = render(
        <WebchatContext.Provider value={context}>
          <AiAgent {...props} />
        </WebchatContext.Provider>
      )

      expect(container.textContent).not.toContain('No tools executed')

      await act(async () => {
        resolvePromise({
          id: 'msg-1',
          type: 'debug',
          action: EventAction.AiAgent,
          text: '',
          event_data: {
            tools_executed: [],
            truncated: false,
          },
        })
        await waitFor(() => undefined, { timeout: 100 })
      })

      expect(container.textContent).toContain('No tools executed')
    })

    test('does not show no tools executed when rehydration returns no event_data', async () => {
      const getMessageById = jest.fn().mockResolvedValue({})
      const context = withWebchatContext({
        previewUtils: { getMessageById },
      })
      const props = defaultAiAgentProps({
        truncated: true,
        hubtype_message_id: 'msg-1',
      })

      const { container } = render(
        <WebchatContext.Provider value={context}>
          <AiAgent {...props} />
        </WebchatContext.Provider>
      )

      await waitFor(() => {
        expect(getMessageById).toHaveBeenCalled()
      })

      expect(container.textContent).not.toContain('No tools executed')
    })
  })

  describe('AiAgentRouter Component', () => {
    const baseRouterProps: AiAgentRouterDebugEvent = {
      action: EventAction.AiAgentRouter,
      flow_node_content_id: 'customer_support_router',
      tools_executed: [],
      memory_length: 2,
      input_guardrails_triggered: [],
      output_guardrails_triggered: [],
      exit: false,
      starting_agent_name: 'customer_support_router',
      last_agent_name: 'customer_support_router',
      available_specialists: [],
      is_transferred_to_specialist: false,
    }

    test('config is always collapsible', () => {
      const config = getAiAgentRouterEventConfig(baseRouterProps)
      expect(config.collapsible).toBe(true)
    })

    test('config is collapsible when transferred', () => {
      const data = {
        ...baseRouterProps,
        is_transferred_to_specialist: true,
        last_agent_name: 'billing_specialist',
      }
      const config = getAiAgentRouterEventConfig(data)
      expect(config.collapsible).toBe(true)
    })

    test('renders available specialists with headset icon', async () => {
      const container = await renderAiAgentRouterInWebchat({
        ...baseRouterProps,
        available_specialists: [
          { name: 'billing_specialist', description: 'Billing' },
          { name: 'technical_support_specialist', description: 'Support' },
        ],
      })

      expect(container.textContent).toContain('Specialists available')
      expect(container.textContent).toContain('billing_specialist')
      expect(container.textContent).toContain('technical_support_specialist')
    })

    test('does not render specialists section when empty', async () => {
      const container = await renderAiAgentRouterInWebchat(baseRouterProps)

      expect(container.textContent).not.toContain('Specialists available')
    })

    test('renders No transfer when not transferred and no guardrails', async () => {
      const container = await renderAiAgentRouterInWebchat(baseRouterProps)

      expect(container.textContent).toContain('No transfer')
    })

    test('renders guardrail at bottom when input guardrail triggered', async () => {
      const container = await renderAiAgentRouterInWebchat({
        ...baseRouterProps,
        input_guardrails_triggered: ['is_competence'],
      })

      expect(container.textContent).toContain('Guardrail triggered')
      expect(container.textContent).toContain('is_competence')
      expect(container.textContent).not.toContain('No transfer')
    })

    test('renders Transferred to when transferred', async () => {
      const container = await renderAiAgentRouterInWebchat({
        ...baseRouterProps,
        is_transferred_to_specialist: true,
        last_agent_name: 'billing_specialist',
      })

      expect(container.textContent).toContain('Transferred to')
      expect(container.textContent).toContain('billing_specialist')
    })
  })

  describe('Event Title Formatting', () => {
    test('HandoffSuccess title is correct', () => {
      const data = {
        action: EventAction.HandoffSuccess,
        queue_name: 'VIP Queue',
        is_queue_open: true,
      } as unknown as HandoffSuccessDebugEvent

      const config = getHandoffSuccessEventConfig(data)
      expect(config.title).toBeTruthy()
      expect(config.action).toBe(EventAction.HandoffSuccess)
    })

    test('AiAgent title is correct', () => {
      const config = getAiAgentEventConfig(
        defaultAiAgentProps({ user_input: 'test' })
      )
      expect(config.title).toBeTruthy()
    })
  })

  describe('Tools Execution Details', () => {
    test('displays multiple tools', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          tools_executed: [
            {
              tool_name: 'tool_one',
              tool_arguments: { arg1: 'value1' },
              tool_results: 'result1',
            },
            {
              tool_name: 'tool_two',
              tool_arguments: { arg2: 'value2' },
              tool_results: 'result2',
            },
          ],
        })
      )

      expect(container.textContent).toContain('tool_one')
      expect(container.textContent).toContain('tool_two')
    })

    test('displays tool with knowledge base sources', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          tools_executed: [
            {
              tool_name: 'search_knowledge',
              tool_arguments: { query: 'test query' },
              tool_results: 'result1',
              knowledgebase_sources_ids: ['src-1', 'src-2'],
              knowledgebase_chunks_ids: ['chunk-1'],
            },
          ],
        })
      )

      expect(container).toBeTruthy()
    })

    test('displays query from tool arguments', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          tools_executed: [
            {
              tool_name: 'retrieve_knowledge',
              tool_arguments: { query: 'What is the return policy?' },
              tool_results: 'result1',
            },
          ],
        })
      )

      expect(container.textContent).toContain('Query')
      expect(container.textContent).toContain('"What is the return policy?"')
    })

    test('displays query from last tool with query', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          tools_executed: [
            {
              tool_name: 'other_tool',
              tool_arguments: { param: 'value' },
              tool_results: 'result1',
            },
            {
              tool_name: 'retrieve_knowledge',
              tool_arguments: { query: 'first query' },
              tool_results: 'result1',
            },
            {
              tool_name: 'retrieve_knowledge',
              tool_arguments: { query: 'second query' },
              tool_results: 'result2',
            },
          ],
        })
      )

      // The implementation uses the last query found in retrieve_knowledge tools
      expect(container.textContent).toContain('"second query"')
      expect(container.textContent).not.toContain('"first query"')
    })

    test('displays exit flag', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({ user_input: 'test', exit: true })
      )

      expect(container.textContent).toContain('Exit')
    })

    test('displays error flag', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({ user_input: 'test', error: true })
      )

      expect(container.textContent).toContain('Error')
    })

    test('displays both exit and error flags', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({ user_input: 'test', exit: true, error: true })
      )

      expect(container.textContent).toContain('Exit')
      expect(container.textContent).toContain('Error')
    })

    test('renders with knowledge base sources and chunks from props', async () => {
      const mockSources = [
        {
          id: 'src-1',
          name: 'Test Source 1',
          source_type: 'pdf',
          url: 'http://example.com/doc1.pdf',
        },
        {
          id: 'src-2',
          name: 'Test Source 2',
          source_type: 'webpage',
          url: 'http://example.com/page1',
        },
      ]

      const mockChunks = [
        {
          id: 'chunk-1',
          source_id: 'src-1',
          content: 'Test chunk content',
        },
      ]

      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          tools_executed: [
            {
              tool_name: 'retrieve_knowledge',
              tool_arguments: { query: 'test query' },
              tool_results: 'result1',
              knowledgebase_sources_ids: ['src-1', 'src-2'],
              knowledgebase_chunks_ids: ['chunk-1'],
            },
          ],
          knowledge_base_chunks_with_sources: [
            {
              source: mockSources[0],
              chunks: mockChunks,
            },
          ] as unknown as AiAgentDebugEvent['knowledge_base_chunks_with_sources'],
        })
      )

      expect(container.textContent).toContain('Knowledge sources')
      expect(container).toBeTruthy()
    })

    test('handles multiple tools with knowledge base references', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          tools_executed: [
            {
              tool_name: 'tool_1',
              tool_arguments: { query: 'first query' },
              tool_results: 'result1',
              knowledgebase_sources_ids: ['src-1'],
              knowledgebase_chunks_ids: ['chunk-1'],
            },
            {
              tool_name: 'tool_2',
              tool_arguments: {},
              tool_results: 'result2',
              knowledgebase_sources_ids: ['src-2'],
              knowledgebase_chunks_ids: ['chunk-2', 'chunk-3'],
            },
          ],
        })
      )

      expect(container.textContent).toContain('tool_1')
      expect(container.textContent).toContain('tool_2')
      expect(container.textContent).toContain('Executed tools')
    })

    test('does not display transfer tools when excludeTransferTools is true', () => {
      const tools = [
        { tool_name: 'transfer_to_billing_agent', tool_arguments: {} },
        { tool_name: 'some_other_tool', tool_arguments: {} },
        { tool_name: 'transfer_to_support_agent', tool_arguments: {} },
      ]

      const { otherTools } = parseTools(tools, true)

      expect(otherTools).toHaveLength(1)
      expect(otherTools[0].tool_name).toBe('some_other_tool')
    })

    test('keeps transfer tools when excludeTransferTools is false', () => {
      const tools = [
        { tool_name: 'transfer_to_billing_agent', tool_arguments: {} },
        { tool_name: 'some_other_tool', tool_arguments: {} },
      ]

      const { otherTools } = parseTools(tools, false)

      expect(otherTools).toHaveLength(2)
    })

    test('does not display query when no tools have query argument', async () => {
      const container = await renderAiAgentInWebchat(
        defaultAiAgentProps({
          user_input: 'test',
          tools_executed: [
            {
              tool_name: 'some_tool',
              tool_arguments: { param: 'value' },
              tool_results: 'result1',
            },
          ],
        })
      )

      expect(container.textContent).not.toContain('Query')
      expect(container.textContent).toContain('some_tool')
    })
  })
})
