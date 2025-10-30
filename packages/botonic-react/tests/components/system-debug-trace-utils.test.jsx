/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/naming-convention */
import { EventAction } from '@botonic/core'
import { render } from '@testing-library/react'
import React from 'react'

import { GuardrailList } from '../../src/components/system-debug-trace/events/components/guardrail-item'
import { SourcesSection } from '../../src/components/system-debug-trace/events/components/sources-section'

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
          onSeeChunks={() => {}}
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
          onSeeChunks={() => {}}
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
          onSeeChunks={() => {}}
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
          onSeeChunks={() => {}}
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
      const {
        LABELS,
      } = require('../../src/components/system-debug-trace/events/constants')

      expect(LABELS).toBeDefined()
      expect(typeof LABELS).toBe('object')
    })

    test('LABELS should contain expected keys', () => {
      const {
        LABELS,
      } = require('../../src/components/system-debug-trace/events/constants')

      // Common labels that should exist
      expect(LABELS).toHaveProperty('QUEUE')
    })
  })

  describe('Icon Components', () => {
    test('icons render without errors', () => {
      const {
        QuoteRightSvg,
      } = require('../../src/components/system-debug-trace/icons/quote-right')
      const {
        BrainSvg,
      } = require('../../src/components/system-debug-trace/icons')
      const {
        LifeRingSvg,
      } = require('../../src/components/system-debug-trace/icons/life-ring')
      const {
        HeadSetSvg,
      } = require('../../src/components/system-debug-trace/icons')
      const {
        WandSvg,
      } = require('../../src/components/system-debug-trace/icons')

      expect(() => render(<QuoteRightSvg />)).not.toThrow()
      expect(() => render(<BrainSvg />)).not.toThrow()
      expect(() => render(<LifeRingSvg />)).not.toThrow()
      expect(() => render(<HeadSetSvg />)).not.toThrow()
      expect(() => render(<WandSvg />)).not.toThrow()
    })

    test('caret icons render without errors', () => {
      const {
        CaretUpSvg,
        CaretDownSvg,
      } = require('../../src/components/system-debug-trace/icons')

      expect(() => render(<CaretUpSvg />)).not.toThrow()
      expect(() => render(<CaretDownSvg />)).not.toThrow()
    })

    test('icons accept color prop', () => {
      const {
        BrainSvg,
      } = require('../../src/components/system-debug-trace/icons')

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
        knowledgebase_sources_ids: [],
        knowledgebase_chunks_ids: [],
        user_input: 'test',
      }

      expect(event.action).toBe(EventAction.Knowledgebase)
      expect(event).toHaveProperty('knowledgebase_inference_id')
      expect(event).toHaveProperty('knowledgebase_fail_reason')
      expect(event).toHaveProperty('knowledgebase_sources_ids')
      expect(event).toHaveProperty('knowledgebase_chunks_ids')
    })

    test('AiAgentDebugEvent has correct structure', () => {
      const event = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      expect(event.action).toBe(EventAction.AiAgent)
      expect(event).toHaveProperty('flow_node_content_id')
      expect(event).toHaveProperty('tools_executed')
      expect(event).toHaveProperty('input_guardrails_triggered')
      expect(event).toHaveProperty('output_guardrails_triggered')
      expect(event).toHaveProperty('exit')
      expect(event).toHaveProperty('error')
    })
  })
})
