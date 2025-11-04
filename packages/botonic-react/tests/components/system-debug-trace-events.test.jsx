/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/naming-convention */
import { EventAction } from '@botonic/core'
import { act, render, waitFor } from '@testing-library/react'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import {
  AiAgent,
  getAiAgentEventConfig,
} from '../../src/components/system-debug-trace/events/ai-agent'
import {
  getHandoffSuccessEventConfig,
  HandoffSuccess,
} from '../../src/components/system-debug-trace/events/handoff-success'
import {
  getKnowledgeBaseEventConfig,
  KnowledgeBase,
} from '../../src/components/system-debug-trace/events/knowledge-base'
import { WebchatContext } from '../../src/webchat/context'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

const mockWebchatContext = {
  previewUtils: {
    onClickOpenChunks: jest.fn(),
    getChunkIdsGroupedBySource: jest.fn().mockResolvedValue([]),
  },
  getKnowledgeBaseSources: jest.fn(),
  getKnowledgeBaseChunks: jest.fn(),
  updateMessage: jest.fn(),
  webchatState: {
    messagesJSON: [],
  },
}

describe('System Debug Trace - Event Components', () => {
  describe('HandoffSuccess Component', () => {
    test('renders queue name correctly', () => {
      const props = {
        action: EventAction.HandoffSuccess,
        handoff_queue_name: 'Premium Support',
        handoff_is_queue_open: true,
      }

      const { container} = render(<HandoffSuccess {...props} />)

      expect(container.textContent).toContain('Premium Support')
    })

    test('displays queue label', () => {
      const props = {
        action: EventAction.HandoffSuccess,
        handoff_queue_name: 'General Support',
        handoff_is_queue_open: false,
      }

      const { container } = render(<HandoffSuccess {...props} />)

      expect(container.textContent).toContain('Queue')
    })

    test('matches snapshot', () => {
      const props = {
        action: EventAction.HandoffSuccess,
        handoff_queue_name: 'Test Queue',
        handoff_is_queue_open: true,
      }

      const sut = <HandoffSuccess {...props} />
      const tree = renderToJSON(sut)
      expect(tree).toMatchSnapshot()
    })
  })

  describe('AiAgent Component', () => {
    test('renders without tools and displays no tools executed label', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'What is the weather?',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container).toBeTruthy()
      expect(container.textContent).toContain('No tools executed')
    })

    test('renders with tools executed', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'Search for flights',
        tools_executed: [
          {
            tool_name: 'search_flights',
            tool_arguments: {
              destination: 'NYC',
              date: '2024-01-01',
            },
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('search_flights')
    })

    test('renders with input guardrails', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'inappropriate content',
        tools_executed: [],
        input_guardrails_triggered: ['profanity_filter', 'pii_detection'],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('profanity_filter')
      expect(container.textContent).toContain('pii_detection')
    })

    test('renders with output guardrails', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: ['toxicity_check'],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('toxicity_check')
    })

    test('renders with both input and output guardrails', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: ['input_guard'],
        output_guardrails_triggered: ['output_guard'],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('input_guard')
      expect(container.textContent).toContain('output_guard')
    })

    test('config has correct properties', () => {
      const data = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      const config = getAiAgentEventConfig(data)

      expect(config.action).toBe(EventAction.AiAgent)
      expect(config.component).toBe(AiAgent)
      expect(config.collapsible).toBe(true)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })
  })

  describe('KnowledgeBase Component', () => {
    test('renders without sources', async () => {
      const props = {
        action: EventAction.Knowledgebase,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        knowledgebase_inference_id: 'inf-1',
        knowledgebase_fail_reason: '',
        knowledgebase_sources_ids: [],
        knowledgebase_chunks_ids: [],
        user_input: 'What is your return policy?',
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <KnowledgeBase {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container).toBeTruthy()
    })

    test('renders with fail reason', async () => {
      const props = {
        action: EventAction.Knowledgebase,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        knowledgebase_inference_id: 'inf-2',
        knowledgebase_fail_reason: 'NOT_FAITHFUL',
        knowledgebase_sources_ids: [],
        knowledgebase_chunks_ids: [],
        user_input: 'test query',
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <KnowledgeBase {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container).toBeTruthy()
    })

    test('renders with sources and chunks', async () => {
      const props = {
        action: EventAction.Knowledgebase,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        knowledgebase_inference_id: 'inf-3',
        knowledgebase_fail_reason: '',
        knowledgebase_sources_ids: ['source-1', 'source-2'],
        knowledgebase_chunks_ids: ['chunk-1', 'chunk-2', 'chunk-3'],
        user_input: 'test query',
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <KnowledgeBase {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container).toBeTruthy()
    })

    test('config has correct properties', () => {
      const data = {
        action: EventAction.Knowledgebase,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        knowledgebase_inference_id: 'inf-1',
        knowledgebase_fail_reason: '',
        knowledgebase_sources_ids: [],
        knowledgebase_chunks_ids: [],
        user_input: 'test',
      }

      const config = getKnowledgeBaseEventConfig(data)

      expect(config.action).toBe(EventAction.Knowledgebase)
      expect(config.component).toBe(KnowledgeBase)
      expect(config.collapsible).toBe(true)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })
  })

  describe('Event Title Formatting', () => {
    test('HandoffSuccess title is correct', () => {
      const data = {
        action: EventAction.HandoffSuccess,
        queue_name: 'VIP Queue',
        is_queue_open: true,
      }

      const config = getHandoffSuccessEventConfig(data)
      expect(config.title).toBeTruthy()
      expect(config.action).toBe(EventAction.HandoffSuccess)
    })

    test('KnowledgeBase title is correct', () => {
      const data = {
        action: EventAction.Knowledgebase,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        knowledgebase_inference_id: 'inf-1',
        knowledgebase_fail_reason: '',
        knowledgebase_sources_ids: [],
        knowledgebase_chunks_ids: [],
        user_input: 'test',
      }

      const config = getKnowledgeBaseEventConfig(data)
      expect(config.title).toBeTruthy()
    })

    test('AiAgent title is correct', () => {
      const data = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      const config = getAiAgentEventConfig(data)
      expect(config.title).toBeTruthy()
    })
  })

  describe('Tools Execution Details', () => {
    test('displays multiple tools', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [
          {
            tool_name: 'tool_one',
            tool_arguments: { arg1: 'value1' },
          },
          {
            tool_name: 'tool_two',
            tool_arguments: { arg2: 'value2' },
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('tool_one')
      expect(container.textContent).toContain('tool_two')
    })

    test('displays tool with knowledge base sources', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [
          {
            tool_name: 'search_knowledge',
            tool_arguments: { query: 'test query' },
            knowledgebase_sources_ids: ['src-1', 'src-2'],
            knowledgebase_chunks_ids: ['chunk-1'],
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container).toBeTruthy()
    })

    test('displays query from tool arguments', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [
          {
            tool_name: 'search_tool',
            tool_arguments: { query: 'What is the return policy?' },
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('Query')
      expect(container.textContent).toContain('"What is the return policy?"')
    })

    test('displays query from last tool with query', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [
          {
            tool_name: 'tool_without_query',
            tool_arguments: { param: 'value' },
          },
          {
            tool_name: 'tool_with_query',
            tool_arguments: { query: 'first query' },
          },
          {
            tool_name: 'another_tool_with_query',
            tool_arguments: { query: 'second query' },
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      // The implementation uses the last query found in tools_executed
      expect(container.textContent).toContain('"second query"')
      expect(container.textContent).not.toContain('"first query"')
    })

    test('displays exit flag', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: true,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('Exit')
    })

    test('displays error flag', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: true,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('Error')
    })

    test('displays both exit and error flags', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: true,
        error: true,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

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

      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [
          {
            tool_name: 'search_tool',
            tool_arguments: { query: 'test query' },
            knowledgebase_sources_ids: ['src-1', 'src-2'],
            knowledgebase_chunks_ids: ['chunk-1'],
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
        knowledge_base_chunks_with_sources: [
          {
            source: mockSources[0],
            chunks: mockChunks,
          },
        ],
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('Knowledge gathered')
      expect(container).toBeTruthy()
    })

    test('handles multiple tools with knowledge base references', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [
          {
            tool_name: 'tool_1',
            tool_arguments: { query: 'first query' },
            knowledgebase_sources_ids: ['src-1'],
            knowledgebase_chunks_ids: ['chunk-1'],
          },
          {
            tool_name: 'tool_2',
            tool_arguments: {},
            knowledgebase_sources_ids: ['src-2'],
            knowledgebase_chunks_ids: ['chunk-2', 'chunk-3'],
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).toContain('tool_1')
      expect(container.textContent).toContain('tool_2')
      expect(container.textContent).toContain('Executed tools')
    })

    test('does not display query when no tools have query argument', async () => {
      const props = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [
          {
            tool_name: 'some_tool',
            tool_arguments: { param: 'value' },
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      let container
      await act(async () => {
        const result = render(
          <WebchatContext.Provider value={mockWebchatContext}>
            <AiAgent {...props} />
          </WebchatContext.Provider>
        )
        container = result.container
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await waitFor(() => {}, { timeout: 100 })
      })

      expect(container.textContent).not.toContain('Query')
      expect(container.textContent).toContain('some_tool')
    })
  })
})
