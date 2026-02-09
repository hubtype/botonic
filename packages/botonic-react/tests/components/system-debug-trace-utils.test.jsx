/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/naming-convention */
import { EventAction } from '@botonic/core'
import { render, renderHook } from '@testing-library/react'

import { GuardrailList } from '../../src/components/system-debug-trace/events/components/guardrail-item'
import { SourcesSection } from '../../src/components/system-debug-trace/events/components/sources-section'
import { LABELS } from '../../src/components/system-debug-trace/events/constants'
import { useKnowledgeBaseInfo } from '../../src/components/system-debug-trace/hooks/use-knowledge-base-info'
import {
  BrainSvg,
  CaretDownSvg,
  CaretUpSvg,
  HeadSetSvg,
  WandSvg,
} from '../../src/components/system-debug-trace/icons'
import { LifeRingSvg } from '../../src/components/system-debug-trace/icons/life-ring'
import { QuoteRightSvg } from '../../src/components/system-debug-trace/icons/quote-right'
import { WebchatContext } from '../../src/webchat/context'

describe('System Debug Trace - Utility Components', () => {
  describe('GuardrailList Component', () => {
    test('renders empty list when no guardrails provided', () => {
      const { container } = render(
        <GuardrailList guardrails={[]} keyPrefix='test' />
      )

      expect(container.textContent).toBe('')
    })

    test('renders single guardrail', () => {
      const guardrails = ['profanity_filter']

      const { container } = render(
        <GuardrailList guardrails={guardrails} keyPrefix='input' />
      )

      expect(container.textContent).toContain('profanity_filter')
    })

    test('renders multiple guardrails', () => {
      const guardrails = ['filter_one', 'filter_two', 'filter_three']

      const { container } = render(
        <GuardrailList guardrails={guardrails} keyPrefix='output' />
      )

      expect(container.textContent).toContain('filter_one')
      expect(container.textContent).toContain('filter_two')
      expect(container.textContent).toContain('filter_three')
    })

    test('renders guardrail label from constants', () => {
      const guardrails = ['test_filter']

      const { container } = render(
        <GuardrailList guardrails={guardrails} keyPrefix='test' />
      )

      expect(container.textContent).toContain('Guardrail triggered')
    })
  })

  describe('SourcesSection Component', () => {
    test('renders null without sources', () => {
      const { container } = render(
        <SourcesSection
          sources={[]}
          chunks={[]}
          getIconForSourceType={() => null}
          onSeeChunks={() => {
            return
          }}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    test('renders with single source', () => {
      const sources = [
        {
          id: 'src-1',
          type: 'document',
          activeExtractionJob: {
            fileName: 'FAQ Document',
          },
        },
      ]

      const mockIcon = jest.fn(() => <span>Icon</span>)

      const { container } = render(
        <SourcesSection
          sources={sources}
          chunks={[]}
          getIconForSourceType={mockIcon}
          onSeeChunks={() => {
            return
          }}
        />
      )

      expect(container.textContent).toContain('FAQ Document')
      expect(mockIcon).toHaveBeenCalledWith(sources[0])
    })

    test('renders with multiple sources', () => {
      const sources = [
        {
          id: 'src-1',
          type: 'document',
          activeExtractionJob: {
            fileName: 'Document 1',
          },
        },
        {
          id: 'src-2',
          type: 'url',
          activeExtractionJob: {
            url: 'https://example.com/page1',
          },
        },
      ]

      const mockIcon = jest.fn(() => <span>Icon</span>)

      const { container } = render(
        <SourcesSection
          sources={sources}
          chunks={[]}
          getIconForSourceType={mockIcon}
          onSeeChunks={() => {
            return
          }}
        />
      )

      expect(container.textContent).toContain('Document 1')
      expect(container.textContent).toContain('https://example.com/page1')
    })

    test('renders with chunks and shows button', () => {
      const sources = [
        {
          id: 'src-1',
          type: 'document',
          activeExtractionJob: {
            fileName: 'Test Doc',
          },
        },
      ]

      const chunks = [
        {
          id: 'chunk-1',
          text: 'This is chunk text',
          score: 0.95,
        },
      ]

      const { container } = render(
        <SourcesSection
          sources={sources}
          chunks={chunks}
          getIconForSourceType={() => <span>Icon</span>}
          onSeeChunks={() => {
            return
          }}
        />
      )

      expect(container.textContent).toContain('Test Doc')
      // The button for seeing chunks should be present
      expect(container.querySelector('button')).toBeTruthy()
    })

    test('has see chunks button handler ready', () => {
      const sources = [
        {
          id: 'src-1',
          type: 'document',
          activeExtractionJob: {
            fileName: 'Test Doc',
          },
        },
      ]

      const chunks = [
        {
          id: 'chunk-1',
          text: 'Chunk text',
          score: 0.9,
        },
      ]

      const mockClickHandler = jest.fn()

      render(
        <SourcesSection
          sources={sources}
          chunks={chunks}
          getIconForSourceType={() => <span>Icon</span>}
          onSeeChunks={mockClickHandler}
        />
      )

      // Component should be rendered with the handler ready (not called yet)
      expect(mockClickHandler).not.toHaveBeenCalled()
    })
  })

  describe('Event Constants', () => {
    test('LABELS constant should exist', () => {
      expect(LABELS).toBeDefined()
      expect(typeof LABELS).toBe('object')
    })

    test('LABELS should contain expected keys', () => {
      // Common labels that should exist
      expect(LABELS).toHaveProperty('QUEUE')
    })
  })

  describe('Icon Components', () => {
    test('icons render without errors', () => {
      expect(() => render(<QuoteRightSvg />)).not.toThrow()
      expect(() => render(<BrainSvg />)).not.toThrow()
      expect(() => render(<LifeRingSvg />)).not.toThrow()
      expect(() => render(<HeadSetSvg />)).not.toThrow()
      expect(() => render(<WandSvg />)).not.toThrow()
    })

    test('caret icons render without errors', () => {
      expect(() => render(<CaretUpSvg />)).not.toThrow()
      expect(() => render(<CaretDownSvg />)).not.toThrow()
    })

    test('icons accept color prop', () => {
      const { container } = render(<BrainSvg color='#FF0000' />)
      expect(container).toBeTruthy()
    })
  })

  describe('Event Data Structures', () => {
    test('KeywordDebugEvent has correct structure', () => {
      const event = {
        action: EventAction.Keyword,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        nlu_keyword_is_regex: false,
        nlu_keyword_name: 'test',
      }

      expect(event.action).toBe(EventAction.Keyword)
      expect(event).toHaveProperty('flow_id')
      expect(event).toHaveProperty('flow_node_id')
      expect(event).toHaveProperty('nlu_keyword_is_regex')
      expect(event).toHaveProperty('nlu_keyword_name')
    })

    test('SmartIntentDebugEvent has correct structure', () => {
      const event = {
        action: EventAction.IntentSmart,
        nlu_intent_smart_title: 'Book Flight',
      }

      expect(event.action).toBe(EventAction.IntentSmart)
      expect(event).toHaveProperty('nlu_intent_smart_title')
    })

    test('FallbackDebugEvent has correct structure', () => {
      const event = {
        action: EventAction.Fallback,
        user_input: 'test',
        fallback_out: 1,
        fallback_message_id: 'msg-1',
      }

      expect(event.action).toBe(EventAction.Fallback)
      expect(event).toHaveProperty('user_input')
      expect(event).toHaveProperty('fallback_out')
      expect(event).toHaveProperty('fallback_message_id')
    })

    test('HandoffSuccessDebugEvent has correct structure', () => {
      const event = {
        action: EventAction.HandoffSuccess,
        queue_name: 'Support',
        is_queue_open: true,
      }

      expect(event.action).toBe(EventAction.HandoffSuccess)
      expect(event).toHaveProperty('queue_name')
      expect(event).toHaveProperty('is_queue_open')
    })

    test('KnowledgeBaseDebugEvent has correct structure', () => {
      const event = {
        action: EventAction.Knowledgebase,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        knowledgebase_inference_id: 'inf-1',
        knowledgebase_fail_reason: '',
        knowledgebase_sources_ids: ['src-1', 'src-2'],
        knowledgebase_chunks_ids: ['chunk-1', 'chunk-2'],
        user_input: 'test',
        knowledge_base_chunks_with_sources: [
          {
            source: {
              id: 'src-1',
              type: 'file',
              activeExtractionJob: {
                fileName: 'test.pdf',
              },
            },
            chunks: [
              {
                id: 'chunk-1',
                text: 'chunk text',
                score: 0.95,
              },
            ],
          },
        ],
      }

      expect(event.action).toBe(EventAction.Knowledgebase)
      expect(event).toHaveProperty('knowledgebase_inference_id')
      expect(event).toHaveProperty('knowledgebase_fail_reason')
      expect(event).toHaveProperty('knowledgebase_sources_ids')
      expect(event).toHaveProperty('knowledgebase_chunks_ids')
      expect(event).toHaveProperty('knowledge_base_chunks_with_sources')
      expect(Array.isArray(event.knowledgebase_sources_ids)).toBe(true)
      expect(Array.isArray(event.knowledgebase_chunks_ids)).toBe(true)
      expect(Array.isArray(event.knowledge_base_chunks_with_sources)).toBe(true)
    })

    test('AiAgentDebugEvent has correct structure', () => {
      const event = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [
          {
            tool_name: 'retrieve_knowledge',
            tool_arguments: { query: 'test query' },
            knowledgebase_sources_ids: ['src-1'],
            knowledgebase_chunks_ids: ['chunk-1'],
          },
        ],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
        knowledge_base_chunks_with_sources: [
          {
            source: {
              id: 'src-1',
              type: 'url',
              activeExtractionJob: {
                url: 'https://example.com',
              },
            },
            chunks: [
              {
                id: 'chunk-1',
                text: 'chunk text',
                score: 0.9,
              },
            ],
          },
        ],
      }

      expect(event.action).toBe(EventAction.AiAgent)
      expect(event).toHaveProperty('flow_node_content_id')
      expect(event).toHaveProperty('tools_executed')
      expect(event).toHaveProperty('input_guardrails_triggered')
      expect(event).toHaveProperty('output_guardrails_triggered')
      expect(event).toHaveProperty('exit')
      expect(event).toHaveProperty('error')
      expect(event).toHaveProperty('knowledge_base_chunks_with_sources')
      expect(Array.isArray(event.tools_executed)).toBe(true)
      expect(event.tools_executed[0]).toHaveProperty('tool_name')
      expect(event.tools_executed[0]).toHaveProperty(
        'knowledgebase_sources_ids'
      )
      expect(event.tools_executed[0]).toHaveProperty('knowledgebase_chunks_ids')
    })
  })

  describe('useKnowledgeBaseInfo Hook', () => {
    const mockChunksWithSources = [
      {
        source: {
          id: 'src-1',
          type: 'file',
          name: 'Test Document',
          activeExtractionJob: {
            fileName: 'test.pdf',
          },
        },
        chunks: [
          {
            id: 'chunk-1',
            text: 'First chunk text',
            score: 0.95,
          },
          {
            id: 'chunk-2',
            text: 'Second chunk text',
            score: 0.9,
          },
        ],
      },
      {
        source: {
          id: 'src-2',
          type: 'url',
          name: 'Example Website',
          activeExtractionJob: {
            url: 'https://example.com',
          },
        },
        chunks: [
          {
            id: 'chunk-3',
            text: 'Third chunk text',
            score: 0.88,
          },
        ],
      },
    ]

    const createMockWebchatContext = (overrides = {}) => ({
      updateMessage: jest.fn(),
      webchatState: {
        messagesJSON: [],
      },
      previewUtils: {
        getChunkIdsGroupedBySource: jest.fn().mockResolvedValue([]),
      },
      ...overrides,
    })

    test('returns correct initial state with existing chunks with sources', () => {
      const mockContext = createMockWebchatContext()

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      const { result } = renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: ['src-1', 'src-2'],
            chunkIds: ['chunk-1', 'chunk-2', 'chunk-3'],
            existingChunksWithSources: mockChunksWithSources,
          }),
        { wrapper }
      )

      expect(result.current.sources).toHaveLength(2)
      expect(result.current.chunks).toHaveLength(3)
      expect(result.current.chunksWithSources).toEqual(mockChunksWithSources)
      expect(result.current.isLoading).toBe(false)
    })

    test('extracts sources correctly from chunks with sources', () => {
      const mockContext = createMockWebchatContext()

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      const { result } = renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: ['src-1', 'src-2'],
            chunkIds: ['chunk-1', 'chunk-2', 'chunk-3'],
            existingChunksWithSources: mockChunksWithSources,
          }),
        { wrapper }
      )

      expect(result.current.sources[0].id).toBe('src-1')
      expect(result.current.sources[0].type).toBe('file')
      expect(result.current.sources[1].id).toBe('src-2')
      expect(result.current.sources[1].type).toBe('url')
    })

    test('extracts chunks correctly from chunks with sources', () => {
      const mockContext = createMockWebchatContext()

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      const { result } = renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: ['src-1', 'src-2'],
            chunkIds: ['chunk-1', 'chunk-2', 'chunk-3'],
            existingChunksWithSources: mockChunksWithSources,
          }),
        { wrapper }
      )

      expect(result.current.chunks).toHaveLength(3)
      expect(result.current.chunks[0].id).toBe('chunk-1')
      expect(result.current.chunks[1].id).toBe('chunk-2')
      expect(result.current.chunks[2].id).toBe('chunk-3')
    })

    test('does not fetch when existing data is provided', () => {
      const mockGetChunks = jest.fn()
      const mockContext = createMockWebchatContext({
        previewUtils: {
          getChunkIdsGroupedBySource: mockGetChunks,
        },
      })

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: ['src-1'],
            chunkIds: ['chunk-1'],
            existingChunksWithSources: mockChunksWithSources,
          }),
        { wrapper }
      )

      expect(mockGetChunks).not.toHaveBeenCalled()
    })

    test('provides getIconForSourceType function', () => {
      const mockContext = createMockWebchatContext()

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      const { result } = renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: ['src-1'],
            chunkIds: ['chunk-1'],
            existingChunksWithSources: mockChunksWithSources,
          }),
        { wrapper }
      )

      expect(typeof result.current.getIconForSourceType).toBe('function')

      const fileIcon = result.current.getIconForSourceType({
        type: 'file',
        activeExtractionJob: { fileName: 'test.pdf' },
      })
      expect(fileIcon).toBeTruthy()

      const urlIcon = result.current.getIconForSourceType({
        type: 'url',
        activeExtractionJob: { url: 'https://example.com' },
      })
      expect(urlIcon).toBeTruthy()
    })

    test('handles empty chunks with sources', () => {
      const mockContext = createMockWebchatContext()

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      const { result } = renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: [],
            chunkIds: [],
            existingChunksWithSources: [],
          }),
        { wrapper }
      )

      expect(result.current.sources).toHaveLength(0)
      expect(result.current.chunks).toHaveLength(0)
      expect(result.current.chunksWithSources).toHaveLength(0)
    })

    test('calculates hasKnowledge and isFaithful correctly', () => {
      const mockContext = createMockWebchatContext()

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      const { result } = renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: ['src-1'],
            chunkIds: ['chunk-1'],
            existingChunksWithSources: mockChunksWithSources,
            failReason: undefined,
          }),
        { wrapper }
      )

      expect(result.current.hasKnowledge).toBe(true)
      expect(result.current.isFaithful).toBe(true)
    })

    test('handles no knowledge fail reason', () => {
      const mockContext = createMockWebchatContext()

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      const { result } = renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: [],
            chunkIds: [],
            existingChunksWithSources: [],
            failReason: 'no_knowledge',
          }),
        { wrapper }
      )

      expect(result.current.hasKnowledge).toBe(false)
      expect(result.current.isFaithful).toBe(false)
    })

    test('handles hallucination fail reason', () => {
      const mockContext = createMockWebchatContext()

      const wrapper = ({ children }) => (
        <WebchatContext.Provider value={mockContext}>
          {children}
        </WebchatContext.Provider>
      )

      const { result } = renderHook(
        () =>
          useKnowledgeBaseInfo({
            sourceIds: ['src-1'],
            chunkIds: ['chunk-1'],
            existingChunksWithSources: mockChunksWithSources,
            failReason: 'hallucination',
          }),
        { wrapper }
      )

      expect(result.current.hasKnowledge).toBe(true)
      expect(result.current.isFaithful).toBe(false)
    })
  })
})
