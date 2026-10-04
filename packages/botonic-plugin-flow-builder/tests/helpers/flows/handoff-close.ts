/* eslint-disable @typescript-eslint/naming-convention */
import { HtNodeWithContentType } from '../../../src/content-fields/hubtype-fields/node-types'

export const HANDOFF_CLOSE_MAIN_FLOW_ID = 'a1000000-0000-4000-8000-000000000001'
export const HANDOFF_CLOSE_FALLBACK_FLOW_ID =
  'a1000000-0000-4000-8000-000000000002'
export const HANDOFF_CLOSE_QUEUE_ID = 'a1000000-0000-4000-8000-000000000010'

export const DIFFERENTIATED_HANDOFF_KEYWORD_ID =
  'a1000000-0000-4000-8000-000000000020'
export const LEGACY_HANDOFF_KEYWORD_ID = 'a1000000-0000-4000-8000-000000000021'
export const DIFFERENTIATED_QUEUE_STATUS_ID =
  'a1000000-0000-4000-8000-000000000030'
export const LEGACY_QUEUE_STATUS_ID = 'a1000000-0000-4000-8000-000000000031'

export const DIFFERENTIATED_PRE_HANDOFF_TEXT_ID =
  'a1000000-0000-4000-8000-000000000040'
export const LEGACY_PRE_HANDOFF_TEXT_ID = 'a1000000-0000-4000-8000-000000000041'

export const DIFFERENTIATED_HANDOFF_ID = 'a1000000-0000-4000-8000-000000000050'
export const LEGACY_HANDOFF_ID = 'a1000000-0000-4000-8000-000000000051'
export const LEGACY_HANDOFF_TARGET_ID = 'a1000000-0000-4000-8000-000000000052'

export const RESOLVED_BY_AGENT_TEXT_ID = 'a1000000-0000-4000-8000-000000000060'
export const DISCARDED_BY_AGENT_TEXT_ID = 'a1000000-0000-4000-8000-000000000061'
export const DISCARDED_BY_USER_TEXT_ID = 'a1000000-0000-4000-8000-000000000062'
export const DISCARDED_BY_SYSTEM_TEXT_ID =
  'a1000000-0000-4000-8000-000000000063'

export const FALLBACK_NODE_ID = 'a1000000-0000-4000-8000-000000000070'
export const FALLBACK_TEXT_ID = 'a1000000-0000-4000-8000-000000000071'

const link = (id: string, type: HtNodeWithContentType | string) => ({
  id,
  type,
})

const textNode = (id: string, code: string, message: string) => ({
  id,
  code,
  is_code_ai_generated: false,
  meta: { x: 0, y: 0 },
  follow_up: null,
  target: null,
  flow_id: HANDOFF_CLOSE_MAIN_FLOW_ID,
  is_meaningful: false,
  ai_translated_locales: [],
  type: 'text',
  content: {
    text: [{ message, locale: 'en' }],
    buttons_style: 'button',
    buttons: [],
  },
})

const queueStatusNode = (
  id: string,
  code: string,
  openTargetId: string,
  closedTextId: string
) => ({
  id,
  code,
  is_code_ai_generated: false,
  meta: { x: 0, y: 0 },
  follow_up: null,
  target: null,
  flow_id: HANDOFF_CLOSE_MAIN_FLOW_ID,
  is_meaningful: false,
  ai_translated_locales: [],
  type: 'function',
  content: {
    action: 'check-queue-status',
    arguments: [
      {
        locale: 'en',
        values: [
          {
            type: 'string',
            name: 'queue_id',
            value: HANDOFF_CLOSE_QUEUE_ID,
          },
          {
            type: 'string',
            name: 'queue_name',
            value: 'HandoffCloseQueue',
          },
        ],
      },
      {
        type: 'boolean',
        name: 'check_available_agents',
        value: false,
      },
    ],
    result_mapping: [
      {
        result: 'open',
        target: link(openTargetId, HtNodeWithContentType.TEXT),
      },
      {
        result: 'closed',
        target: link(closedTextId, HtNodeWithContentType.TEXT),
      },
      {
        result: 'open-without-agents',
        target: null,
      },
    ],
  },
})

const keywordNode = (id: string, keyword: string, targetId: string) => ({
  id,
  code: '',
  is_code_ai_generated: false,
  meta: { x: 0, y: 0 },
  follow_up: null,
  target: link(targetId, 'function'),
  flow_id: HANDOFF_CLOSE_MAIN_FLOW_ID,
  is_meaningful: false,
  ai_translated_locales: [],
  type: 'keyword',
  content: {
    title: [],
    keywords: [{ values: [keyword], locale: 'en' }],
  },
})

export const handoffCloseFlow = {
  version: 'draft',
  name: 'Handoff close payload test',
  comments: null,
  published_by: null,
  published_on: null,
  hash: 'handoff-close-test-hash',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: null,
  ai_model_id: null,
  is_knowledge_base_active: false,
  is_ai_agent_active: false,
  nodes: [
    {
      id: DIFFERENTIATED_PRE_HANDOFF_TEXT_ID,
      code: 'DIFF_PRE_HANDOFF',
      is_code_ai_generated: false,
      meta: { x: 0, y: 0 },
      follow_up: link(DIFFERENTIATED_HANDOFF_ID, HtNodeWithContentType.HANDOFF),
      target: null,
      flow_id: HANDOFF_CLOSE_MAIN_FLOW_ID,
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          { message: 'Connecting to differentiated handoff', locale: 'en' },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: LEGACY_PRE_HANDOFF_TEXT_ID,
      code: 'LEGACY_PRE_HANDOFF',
      is_code_ai_generated: false,
      meta: { x: 0, y: 0 },
      follow_up: link(LEGACY_HANDOFF_ID, HtNodeWithContentType.HANDOFF),
      target: null,
      flow_id: HANDOFF_CLOSE_MAIN_FLOW_ID,
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [{ message: 'Connecting to legacy handoff', locale: 'en' }],
        buttons_style: 'button',
        buttons: [],
      },
    },
    textNode(RESOLVED_BY_AGENT_TEXT_ID, 'RESOLVED', 'Case resolved by agent'),
    textNode(
      DISCARDED_BY_AGENT_TEXT_ID,
      'DISCARDED_AGENT',
      'Case discarded by agent'
    ),
    textNode(
      DISCARDED_BY_USER_TEXT_ID,
      'DISCARDED_USER',
      'Case discarded by user'
    ),
    textNode(
      DISCARDED_BY_SYSTEM_TEXT_ID,
      'DISCARDED_SYSTEM',
      'Case discarded by system'
    ),
    textNode(
      LEGACY_HANDOFF_TARGET_ID,
      'LEGACY_TARGET',
      'Legacy handoff finished'
    ),
    textNode(
      DIFFERENTIATED_QUEUE_STATUS_ID + '-closed',
      'QUEUE_CLOSED',
      'Queue is closed'
    ),
    {
      id: DIFFERENTIATED_HANDOFF_ID,
      code: 'DIFF_HANDOFF',
      is_code_ai_generated: false,
      meta: { x: 0, y: 0 },
      follow_up: null,
      target: null,
      flow_id: HANDOFF_CLOSE_MAIN_FLOW_ID,
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'handoff',
      content: {
        queue: [
          {
            id: HANDOFF_CLOSE_QUEUE_ID,
            name: 'HandoffCloseQueue',
            locale: 'en',
          },
        ],
        payload: [],
        has_auto_assign: false,
        has_queue_position_changed_notifications_enabled: false,
        has_differentiated_close_types: true,
        resolved_by_agent: link(
          RESOLVED_BY_AGENT_TEXT_ID,
          HtNodeWithContentType.TEXT
        ),
        discarded_by_agent: link(
          DISCARDED_BY_AGENT_TEXT_ID,
          HtNodeWithContentType.TEXT
        ),
        discarded_by_user: link(
          DISCARDED_BY_USER_TEXT_ID,
          HtNodeWithContentType.TEXT
        ),
        discarded_by_system: link(
          DISCARDED_BY_SYSTEM_TEXT_ID,
          HtNodeWithContentType.TEXT
        ),
      },
    },
    {
      id: LEGACY_HANDOFF_ID,
      code: 'LEGACY_HANDOFF',
      is_code_ai_generated: false,
      meta: { x: 0, y: 0 },
      follow_up: null,
      target: link(LEGACY_HANDOFF_TARGET_ID, 'go-to-flow'),
      flow_id: HANDOFF_CLOSE_MAIN_FLOW_ID,
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'handoff',
      content: {
        queue: [
          {
            id: HANDOFF_CLOSE_QUEUE_ID,
            name: 'HandoffCloseQueue',
            locale: 'en',
          },
        ],
        payload: [],
        has_auto_assign: false,
        has_queue_position_changed_notifications_enabled: false,
        has_differentiated_close_types: false,
      },
    },
    queueStatusNode(
      DIFFERENTIATED_QUEUE_STATUS_ID,
      'DIFF_QUEUE_STATUS',
      DIFFERENTIATED_PRE_HANDOFF_TEXT_ID,
      `${DIFFERENTIATED_QUEUE_STATUS_ID}-closed`
    ),
    queueStatusNode(
      LEGACY_QUEUE_STATUS_ID,
      'LEGACY_QUEUE_STATUS',
      LEGACY_PRE_HANDOFF_TEXT_ID,
      `${DIFFERENTIATED_QUEUE_STATUS_ID}-closed`
    ),
    keywordNode(
      DIFFERENTIATED_HANDOFF_KEYWORD_ID,
      'diffHandoff',
      DIFFERENTIATED_QUEUE_STATUS_ID
    ),
    keywordNode(
      LEGACY_HANDOFF_KEYWORD_ID,
      'legacyHandoff',
      LEGACY_QUEUE_STATUS_ID
    ),
    {
      id: FALLBACK_NODE_ID,
      code: 'Fallback',
      is_code_ai_generated: false,
      meta: { x: 0, y: 0 },
      follow_up: null,
      target: null,
      flow_id: HANDOFF_CLOSE_FALLBACK_FLOW_ID,
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'fallback',
      content: {
        first_message: link(FALLBACK_TEXT_ID, HtNodeWithContentType.TEXT),
        second_message: null,
        is_knowledge_base_active: false,
        knowledge_base_followup: null,
      },
    },
    textNode(FALLBACK_TEXT_ID, 'FALLBACK_MSG', 'Fallback message'),
  ],
  flows: [
    {
      id: HANDOFF_CLOSE_MAIN_FLOW_ID,
      name: 'Main',
      start_node_id: DIFFERENTIATED_HANDOFF_KEYWORD_ID,
    },
    {
      id: HANDOFF_CLOSE_FALLBACK_FLOW_ID,
      name: 'Fallback',
      start_node_id: FALLBACK_NODE_ID,
    },
  ],
  webviews: [],
  campaigns: [],
  bot_variable_definitions: [],
}
