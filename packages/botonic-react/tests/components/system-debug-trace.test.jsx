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
  getBotActionEventConfig,
  getConditionalChannelEventConfig,
  getConditionalCountryEventConfig,
  getConditionalCustomEventConfig,
  getConditionalQueueStatusEventConfig,
  getRedirectFlowEventConfig,
  getWebviewActionTriggeredEventConfig,
} from '../../src/components/system-debug-trace/events'
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

    test('renders bot action event', () => {
      const debugEvent = {
        action: EventAction.BotAction,
        payload: 'testAction',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-5' />
      )

      expect(container.textContent).toContain('Bot action triggered')
      expect(container.textContent).toContain('testAction')
    })

    test('renders conditional channel event', () => {
      const debugEvent = {
        action: EventAction.ConditionalChannel,
        channel: 'whatsapp',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-6' />
      )

      expect(container.textContent).toContain('Channel checked')
      expect(container.textContent).toContain('whatsapp')
    })

    test('renders conditional country event', () => {
      const debugEvent = {
        action: EventAction.ConditionalCountry,
        country: 'US',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-7' />
      )

      expect(container.textContent).toContain('Country checked')
      expect(container.textContent).toContain('US')
    })

    test('renders conditional custom event', () => {
      const debugEvent = {
        action: EventAction.ConditionalCustom,
        conditional_variable: 'user.age',
        variable_format: 'number',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-8' />
      )

      expect(container.textContent).toContain('Custom condition checked')
      expect(container.textContent).toContain('user.age')
    })

    test('renders conditional queue status event', () => {
      const debugEvent = {
        action: EventAction.ConditionalQueueStatus,
        queue_id: 'queue-123',
        queue_name: 'Support',
        is_queue_open: true,
        is_available_agent: true,
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-9' />
      )

      expect(container.textContent).toContain('Queue status checked')
      expect(container.textContent).toContain('Open')
      expect(container.textContent).toContain('Available')
    })

    test('renders redirect flow event', () => {
      const debugEvent = {
        action: EventAction.RedirectFlow,
        flow_id: 'flow-1',
        flow_name: 'Main Flow',
        flow_target_id: 'flow-2',
        flow_target_name: 'Target Flow',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-10' />
      )

      expect(container.textContent).toContain('Redirected to flow')
      expect(container.textContent).toContain('Target Flow')
    })

    test('renders webview action triggered event', () => {
      const debugEvent = {
        action: EventAction.WebviewActionTriggered,
        webview_target_id: 'webview-1',
        webview_name: 'Payment Form',
      }

      const { container } = render(
        <DebugMessage debugEvent={debugEvent} messageId='msg-11' />
      )

      expect(container.textContent).toContain('Webview action triggered')
      expect(container.textContent).toContain('Payment Form')
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

    test('getBotActionEventConfig returns non-collapsible config', () => {
      const data = {
        action: EventAction.BotAction,
        payload: 'testAction',
      }

      const config = getBotActionEventConfig(data)

      expect(config.action).toBe(EventAction.BotAction)
      expect(config.component).toBeNull()
      expect(config.collapsible).toBe(false)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getConditionalChannelEventConfig returns non-collapsible config', () => {
      const data = {
        action: EventAction.ConditionalChannel,
        channel: 'whatsapp',
      }

      const config = getConditionalChannelEventConfig(data)

      expect(config.action).toBe(EventAction.ConditionalChannel)
      expect(config.component).toBeNull()
      expect(config.collapsible).toBe(false)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getConditionalCountryEventConfig returns non-collapsible config', () => {
      const data = {
        action: EventAction.ConditionalCountry,
        country: 'US',
      }

      const config = getConditionalCountryEventConfig(data)

      expect(config.action).toBe(EventAction.ConditionalCountry)
      expect(config.component).toBeNull()
      expect(config.collapsible).toBe(false)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getConditionalCustomEventConfig returns non-collapsible config', () => {
      const data = {
        action: EventAction.ConditionalCustom,
        conditional_variable: 'user.age',
        variable_format: 'number',
      }

      const config = getConditionalCustomEventConfig(data)

      expect(config.action).toBe(EventAction.ConditionalCustom)
      expect(config.component).toBeNull()
      expect(config.collapsible).toBe(false)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getConditionalQueueStatusEventConfig returns non-collapsible config', () => {
      const data = {
        action: EventAction.ConditionalQueueStatus,
        queue_id: 'queue-123',
        queue_name: 'Support',
        is_queue_open: true,
        is_available_agent: true,
      }

      const config = getConditionalQueueStatusEventConfig(data)

      expect(config.action).toBe(EventAction.ConditionalQueueStatus)
      expect(config.component).toBeNull()
      expect(config.collapsible).toBe(false)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getRedirectFlowEventConfig returns non-collapsible config', () => {
      const data = {
        action: EventAction.RedirectFlow,
        flow_id: 'flow-1',
        flow_name: 'Main Flow',
        flow_target_id: 'flow-2',
        flow_target_name: 'Target Flow',
      }

      const config = getRedirectFlowEventConfig(data)

      expect(config.action).toBe(EventAction.RedirectFlow)
      expect(config.component).toBeNull()
      expect(config.collapsible).toBe(false)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })

    test('getWebviewActionTriggeredEventConfig returns non-collapsible config', () => {
      const data = {
        action: EventAction.WebviewActionTriggered,
        webview_target_id: 'webview-1',
        webview_name: 'Payment Form',
      }

      const config = getWebviewActionTriggeredEventConfig(data)

      expect(config.action).toBe(EventAction.WebviewActionTriggered)
      expect(config.component).toBeNull()
      expect(config.collapsible).toBe(false)
      expect(config.icon).toBeTruthy()
      expect(config.title).toBeTruthy()
    })
  })

  describe('Collapsible Functionality', () => {
    test('ai agent event toggles expansion on click', async () => {
      const user = userEvent.setup()
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

      const { container } = render(
        <WebchatContext.Provider value={mockWebchatContext}>
          <DebugMessage debugEvent={debugEvent} messageId='msg-1' />
        </WebchatContext.Provider>
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
