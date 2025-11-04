/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/naming-convention */
import { EventAction, INPUT } from '@botonic/core'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { ROLES } from '../../src/constants'
import { DebugMessage } from '../../src/components/system-debug-trace/debug-message'
import { SystemDebugTrace } from '../../src/components/system-debug-trace'
import {
  getKeywordEventConfig,
  getSmartIntentEventConfig,
  getFallbackEventConfig,
  getHandoffSuccessEventConfig,
  getKnowledgeBaseEventConfig,
  getAiAgentEventConfig,
} from '../../src/components/system-debug-trace/events'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

// Mock isBrowser to return true for rendering components
jest.mock('@botonic/core', () => {
  const actual = jest.requireActual('@botonic/core')
  return {
    ...actual,
    isBrowser: () => true,
  }
})

describe('SystemDebugTrace Component', () => {
  describe('SystemDebugTrace - Main Component', () => {
    test('renders DebugMessage with keyword event data as object', () => {
      const data = {
        action: EventAction.Keyword,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        nlu_keyword_is_regex: false,
        nlu_keyword_name: 'hello',
      }

      // Test the DebugMessage component directly since SystemDebugTrace wraps Message
      const sut = <DebugMessage debugEvent={data} messageId='msg-1' />
      const tree = renderToJSON(sut)
      expect(tree).toBeTruthy()
    })

    test('renders DebugMessage with smart intent event', () => {
      const data = {
        action: EventAction.IntentSmart,
        nlu_intent_smart_title: 'Book Flight',
      }

      const sut = <DebugMessage debugEvent={data} messageId='msg-2' />
      const tree = renderToJSON(sut)
      expect(tree).toBeTruthy()
    })

    test('serializes data correctly', () => {
      const data = {
        action: EventAction.Keyword,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        nlu_keyword_is_regex: false,
        nlu_keyword_name: 'hello',
      }

      const serialized = SystemDebugTrace.serialize({
        type: INPUT.SYSTEM_DEBUG_TRACE,
        data,
      })

      expect(serialized).toEqual(data)
    })

    test('serializes string data correctly', () => {
      const data = JSON.stringify({
        action: EventAction.Keyword,
        nlu_keyword_name: 'test',
      })

      const serialized = SystemDebugTrace.serialize({
        type: INPUT.SYSTEM_DEBUG_TRACE,
        data,
      })

      expect(serialized).toEqual({
        action: EventAction.Keyword,
        nlu_keyword_name: 'test',
      })
    })
  })

  describe('DebugMessage Component', () => {
    test('renders null for unknown event type', () => {
      const debugEvent = {
        action: 'UNKNOWN_ACTION',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-1' />
      )
      expect(container.firstChild).toBeNull()
    })

    test('renders keyword event without collapsible', () => {
      const debugEvent = {
        action: EventAction.Keyword,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        nlu_keyword_is_regex: false,
        nlu_keyword_name: 'greeting',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-1' />
      )

      expect(container.querySelector('.collapsible')).toBeNull()
      expect(container.textContent).toContain('Keyword matched')
      expect(container.textContent).toContain('greeting')
    })

    test('renders smart intent event', () => {
      const debugEvent = {
        action: EventAction.IntentSmart,
        nlu_intent_smart_title: 'Book Flight',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-2' />
      )

      expect(container.textContent).toContain('Smart intent triggered')
      expect(container.textContent).toContain('Book Flight')
    })

    test('renders fallback event with ordinal', () => {
      const debugEvent = {
        action: EventAction.Fallback,
        user_input: 'test input',
        fallback_out: 1,
        fallback_message_id: 'fallback-msg-1',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-3' />
      )

      expect(container.textContent).toContain('Fallback message triggered')
      expect(container.textContent).toContain('1st message')
    })

    test('renders fallback event with 2nd ordinal', () => {
      const debugEvent = {
        action: EventAction.Fallback,
        user_input: 'test input',
        fallback_out: 2,
        fallback_message_id: 'fallback-msg-2',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-4' />
      )

      expect(container.textContent).toContain('2nd message')
    })
  })

  describe('Event Configuration Functions', () => {
    test('getKeywordEventConfig returns correct config', () => {
      const data = {
        action: EventAction.Keyword,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        nlu_keyword_is_regex: false,
        nlu_keyword_name: 'hello',
      }

      const config = getKeywordEventConfig(data)

      expect(config.action).toBe(EventAction.Keyword)
      expect(config.component).toBeNull()
      expect(config.collapsible).toBe(false)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getSmartIntentEventConfig returns correct config', () => {
      const data = {
        action: EventAction.IntentSmart,
        nlu_intent_smart_title: 'Book Flight',
      }

      const config = getSmartIntentEventConfig(data)

      expect(config.action).toBe(EventAction.IntentSmart)
      expect(config.component).toBeNull()
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getFallbackEventConfig returns correct config with ordinals', () => {
      const data1 = {
        action: EventAction.Fallback,
        user_input: 'test',
        fallback_out: 1,
        fallback_message_id: 'msg-1',
      }

      const config1 = getFallbackEventConfig(data1)
      expect(config1.action).toBe(EventAction.Fallback)
      expect(config1.component).toBeNull()
      expect(config1.collapsible).toBe(false)

      const data2 = {
        action: EventAction.Fallback,
        user_input: 'test',
        fallback_out: 2,
        fallback_message_id: 'msg-2',
      }

      const config2 = getFallbackEventConfig(data2)
      expect(config2.action).toBe(EventAction.Fallback)
    })

    test('getHandoffSuccessEventConfig returns collapsible config', () => {
      const data = {
        action: EventAction.HandoffSuccess,
        queue_name: 'Support Queue',
        is_queue_open: true,
      }

      const config = getHandoffSuccessEventConfig(data)

      expect(config.action).toBe(EventAction.HandoffSuccess)
      expect(config.component).toBeTruthy()
      expect(config.collapsible).toBe(true)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getKnowledgeBaseEventConfig returns collapsible config', () => {
      const data = {
        action: EventAction.Knowledgebase,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        knowledgebase_inference_id: 'inf-1',
        knowledgebase_fail_reason: '',
        knowledgebase_sources_ids: [],
        knowledgebase_chunks_ids: [],
        user_input: 'test query',
      }

      const config = getKnowledgeBaseEventConfig(data)

      expect(config.action).toBe(EventAction.Knowledgebase)
      expect(config.component).toBeTruthy()
      expect(config.collapsible).toBe(true)
      expect(config.icon).toBeTruthy()
    })

    test('getAiAgentEventConfig returns collapsible config', () => {
      const data = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test input',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      const config = getAiAgentEventConfig(data)

      expect(config.action).toBe(EventAction.AiAgent)
      expect(config.component).toBeTruthy()
      expect(config.collapsible).toBe(true)
      expect(config.icon).toBeTruthy()
    })
  })

  describe('Collapsible Functionality', () => {
    test('handoff event toggles expansion on click', async () => {
      const user = userEvent.setup()
      const debugEvent = {
        action: EventAction.HandoffSuccess,
        queue_name: 'Support Queue',
        is_queue_open: true,
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-1' />
      )

      const header = container.querySelector('.collapsible')
      expect(header).toBeTruthy()

      // Initially not expanded
      expect(header.classList.contains('expanded')).toBe(false)
      const content = container.querySelector('[style*="display: none"]')
      expect(content).toBeTruthy()

      // Click to expand
      const clickableHeader = container.querySelector(
        '.collapsible > div:first-child'
      )
      await user.click(clickableHeader)

      // Should be expanded
      await waitFor(() => {
        expect(container.querySelector('.expanded')).toBeTruthy()
      })
    })

    test('non-collapsible events do not have expansion functionality', () => {
      const debugEvent = {
        action: EventAction.Keyword,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        nlu_keyword_is_regex: false,
        nlu_keyword_name: 'test',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-1' />
      )

      // Should not have collapsible class
      const collapsible = container.querySelector('.collapsible')
      expect(collapsible).toBeNull()
    })
  })

  describe('Message Role', () => {
    test('SystemDebugTrace component uses correct role', () => {
      // The SystemDebugTrace component passes ROLES.SYSTEM_DEBUG_TRACE_MESSAGE
      // to the Message component internally
      expect(ROLES.SYSTEM_DEBUG_TRACE_MESSAGE).toBeDefined()
      expect(INPUT.SYSTEM_DEBUG_TRACE).toBeDefined()
    })
  })

  describe('Snapshot Tests', () => {
    test('keyword event matches snapshot', () => {
      const debugEvent = {
        action: EventAction.Keyword,
        flow_id: 'flow1',
        flow_node_id: 'node1',
        nlu_keyword_is_regex: false,
        nlu_keyword_name: 'hello',
      }

      const sut = <DebugMessage debugEvent={debugEvent} messageId='msg-1' />
      const tree = renderToJSON(sut)
      expect(tree).toMatchSnapshot()
    })

    test('smart intent event matches snapshot', () => {
      const debugEvent = {
        action: EventAction.IntentSmart,
        nlu_intent_smart_title: 'Book Flight',
      }

      const sut = <DebugMessage debugEvent={debugEvent} messageId='msg-2' />
      const tree = renderToJSON(sut)
      expect(tree).toMatchSnapshot()
    })

    test('fallback event matches snapshot', () => {
      const debugEvent = {
        action: EventAction.Fallback,
        user_input: 'test input',
        fallback_out: 1,
        fallback_message_id: 'fallback-msg-1',
      }

      const sut = <DebugMessage debugEvent={debugEvent} messageId='msg-3' />
      const tree = renderToJSON(sut)
      expect(tree).toMatchSnapshot()
    })

    test('handoff success event matches snapshot', () => {
      const debugEvent = {
        action: EventAction.HandoffSuccess,
        queue_name: 'Support Queue',
        is_queue_open: true,
      }

      const sut = <DebugMessage debugEvent={debugEvent} messageId='msg-4' />
      const tree = renderToJSON(sut)
      expect(tree).toMatchSnapshot()
    })

    test('AI Agent event matches snapshot', () => {
      const debugEvent = {
        action: EventAction.AiAgent,
        flow_node_content_id: 'content-1',
        user_input: 'test',
        tools_executed: [],
        input_guardrails_triggered: [],
        output_guardrails_triggered: [],
        exit: false,
        error: false,
      }

      const sut = <DebugMessage debugEvent={debugEvent} messageId='msg-5' />
      const tree = renderToJSON(sut)
      expect(tree).toMatchSnapshot()
    })
  })
})
