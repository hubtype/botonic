/**
 * Dev-only mock payloads for every SystemDebugTrace event type.
 *
 * Usage from dev-entry.ts:
 *   import { DEBUG_SYSTEM_MESSAGES } from '@botonic/react/src/debug-system-messages'
 *   app.addDebugSystemMessage(DEBUG_SYSTEM_MESSAGES.keyword)
 *
 * Usage from the browser console (window.Botonic is the DevApp instance):
 *   Botonic.addDebugSystemMessage({ action: 'nlu_keyword', nlu_keyword_name: 'hello', ... })
 *   // or use the pre-built fixtures exposed on the DevApp:
 *   Botonic.addDebugSystemMessage(Botonic.debugSystemMessages.aiAgent)
 */

import { EventAction } from '@botonic/core'

import type {
  AiAgentDebugEvent,
  BotActionDebugEvent,
  ConditionalChannelDebugEvent,
  ConditionalCountryDebugEvent,
  ConditionalCustomDebugEvent,
  ConditionalQueueStatusDebugEvent,
  FallbackDebugEvent,
  HandoffSuccessDebugEvent,
  KeywordDebugEvent,
  KnowledgeBaseDebugEvent,
  RedirectFlowDebugEvent,
  SmartIntentDebugEvent,
  WebviewActionTriggeredDebugEvent,
} from './components/system-debug-trace/events'
import type { ChunkIdsGroupedBySourceData } from './components/system-debug-trace/events/knowledge-bases-types'
import type { DebugEvent } from './components/system-debug-trace/types'

const mockChunksWithSources: ChunkIdsGroupedBySourceData[] = [
  {
    source: {
      id: 'src-mock-001',
      name: 'Help Center',
      type: 'url',
      scrapingCountryCode: null,
      createdAt: '2026-01-01T00:00:00Z',
      createdBy: 'mock',
      lastUpdatedAt: '2026-01-01T00:00:00Z',
      lastUpdatedBy: 'mock',
      activeExtractionJob: null as any,
      lastExtractionJob: null as any,
    },
    chunks: [
      {
        id: 'chunk-mock-001',
        text: 'To reset your password, go to Settings > Security > Reset Password.',
      },
    ],
  },
]

export const DEBUG_SYSTEM_MESSAGES = {
  keyword: {
    action: EventAction.Keyword,
    flow_id: 'flow-mock-001',
    flow_node_id: 'node-mock-001',
    nlu_keyword_is_regex: false,
    nlu_keyword_name: 'hello',
  } satisfies KeywordDebugEvent,

  smartIntent: {
    action: EventAction.IntentSmart,
    nlu_intent_smart_title: 'Greeting smart intent',
  } satisfies SmartIntentDebugEvent,

  fallback: {
    action: EventAction.Fallback,
    user_input: "I don't understand this bot",
    fallback_out: 1,
    fallback_message_id: 'msg-mock-002',
  } satisfies FallbackDebugEvent,

  handoffSuccess: {
    action: EventAction.HandoffSuccess,
    handoff_queue_name: 'Support Team',
    handoff_is_queue_open: true,
    handoff_has_auto_assign: true,
    handoff_note_id: '',
  } satisfies HandoffSuccessDebugEvent,

  botAction: {
    action: EventAction.BotAction,
    payload: 'custom-action-result',
  } satisfies BotActionDebugEvent,

  knowledgeBase: {
    action: EventAction.Knowledgebase,
    flow_id: 'flow-mock-001',
    flow_node_id: 'node-mock-004',
    knowledgebase_inference_id: 'inf-mock-001',
    knowledgebase_fail_reason: '',
    knowledgebase_sources_ids: ['src-mock-001'],
    knowledgebase_chunks_ids: ['chunk-mock-001'],
    user_input: 'How do I reset my password?',
    knowledge_base_chunks_with_sources: mockChunksWithSources,
  } satisfies KnowledgeBaseDebugEvent,

  knowledgeBaseFailed: {
    action: EventAction.Knowledgebase,
    flow_id: 'flow-mock-001',
    flow_node_id: 'node-mock-004',
    knowledgebase_inference_id: 'inf-mock-002',
    knowledgebase_fail_reason: 'no_relevant_content',
    knowledgebase_sources_ids: [],
    knowledgebase_chunks_ids: [],
    user_input: 'What is the meaning of life?',
    knowledge_base_chunks_with_sources: [],
  } satisfies KnowledgeBaseDebugEvent,

  conditionalChannel: {
    action: EventAction.ConditionalChannel,
    channel: 'whatsapp',
  } satisfies ConditionalChannelDebugEvent,

  conditionalCountry: {
    action: EventAction.ConditionalCountry,
    country: 'ES',
  } satisfies ConditionalCountryDebugEvent,

  conditionalCustom: {
    action: EventAction.ConditionalCustom,
    conditional_variable: 'user_plan',
    variable_format: 'string',
  } satisfies ConditionalCustomDebugEvent,

  conditionalQueueStatus: {
    action: EventAction.ConditionalQueueStatus,
    queue_id: 'queue-mock-001',
    queue_name: 'Support Team',
    is_queue_open: true,
    is_available_agent: true,
  } satisfies ConditionalQueueStatusDebugEvent,

  redirectFlow: {
    action: EventAction.RedirectFlow,
    flow_id: 'flow-mock-001',
    flow_name: 'Main Flow',
    flow_target_id: 'flow-mock-002',
    flow_target_name: 'Billing Flow',
  } satisfies RedirectFlowDebugEvent,

  webviewActionTriggered: {
    action: EventAction.WebviewActionTriggered,
    webview_target_id: 'webview-mock-001',
    webview_name: 'Payment Form',
  } satisfies WebviewActionTriggeredDebugEvent,

  aiAgent: {
    action: EventAction.AiAgent,
    flow_node_content_id: 'content-mock-001',
    user_input: 'Can you help me with my subscription?',
    tools_executed: [
      {
        tool_name: 'retrieve_knowledge',
        tool_arguments: { query: 'subscription management' },
        tool_results: 'Found 3 relevant articles about subscription management.',
        knowledgebase_sources_ids: ['src-mock-001'],
        knowledgebase_chunks_ids: ['chunk-mock-001'],
      },
      {
        tool_name: 'get_user_subscription',
        tool_arguments: { user_id: 'user-mock-001' },
        tool_results: '{"plan": "pro", "renewal_date": "2026-06-01"}',
      },
    ],
    input_guardrails_triggered: [],
    output_guardrails_triggered: [],
    exit: false,
    error: false,
    knowledge_base_chunks_with_sources: mockChunksWithSources,
  } satisfies AiAgentDebugEvent,

  aiAgentWithGuardrails: {
    action: EventAction.AiAgent,
    flow_node_content_id: 'content-mock-002',
    user_input: 'Tell me something inappropriate',
    tools_executed: [],
    input_guardrails_triggered: ['content_safety', 'topic_restriction'],
    output_guardrails_triggered: [],
    exit: false,
    error: false,
  } satisfies AiAgentDebugEvent,

  aiAgentError: {
    action: EventAction.AiAgent,
    flow_node_content_id: 'content-mock-003',
    user_input: 'Hello',
    tools_executed: [],
    input_guardrails_triggered: [],
    output_guardrails_triggered: [],
    exit: false,
    error: true,
  } satisfies AiAgentDebugEvent,
} satisfies Record<string, DebugEvent>
