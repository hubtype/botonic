/* eslint-disable @typescript-eslint/naming-convention */
export const campaignsFlow = {
  version: 'draft',
  name: 'Campaigns Test',
  comments: null,
  published_by: null,
  published_on: null,
  hash: 'campaigns-test-hash',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: 'main-start-node',
  ai_model_id: null,
  is_knowledge_base_active: false,
  nodes: [
    // Main flow start node
    {
      id: 'main-start-node',
      code: 'MAIN_START',
      is_code_ai_generated: false,
      meta: { x: 0, y: 0 },
      follow_up: null,
      target: null,
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [{ message: 'Welcome to main flow', locale: 'en' }],
        buttons_style: 'button',
        buttons: [],
      },
    },
    // Campaign 1 start node
    {
      id: 'campaign-1-start-node',
      code: 'CAMPAIGN_1_START',
      is_code_ai_generated: false,
      meta: { x: 300, y: 0 },
      follow_up: {
        id: 'campaign-1-followup-node',
        type: 'text',
      },
      target: null,
      flow_id: 'campaign-1-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          { message: 'Welcome to Campaign 1 - Summer Sale!', locale: 'en' },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    // Campaign 1 follow-up node
    {
      id: 'campaign-1-followup-node',
      code: 'CAMPAIGN_1_FOLLOWUP',
      is_code_ai_generated: false,
      meta: { x: 600, y: 0 },
      follow_up: null,
      target: null,
      flow_id: 'campaign-1-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [{ message: 'Get 50% off all items!', locale: 'en' }],
        buttons_style: 'button',
        buttons: [],
      },
    },
    // Campaign 2 start node
    {
      id: 'campaign-2-start-node',
      code: 'CAMPAIGN_2_START',
      is_code_ai_generated: false,
      meta: { x: 300, y: 200 },
      follow_up: null,
      target: null,
      flow_id: 'campaign-2-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'Welcome to Campaign 2 - New Product Launch!',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    // Fallback node
    {
      id: 'fallback-node',
      code: 'FALLBACK',
      is_code_ai_generated: false,
      meta: { x: 0, y: -100 },
      follow_up: null,
      target: null,
      flow_id: 'fallback-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'fallback',
      content: {
        first_message: { id: 'fallback-message-node', type: 'text' },
        second_message: { id: 'fallback-message-node', type: 'text' },
        is_knowledge_base_active: false,
        knowledge_base_followup: null,
      },
    },
    // Fallback message
    {
      id: 'fallback-message-node',
      code: 'FALLBACK_MSG',
      is_code_ai_generated: false,
      meta: { x: 300, y: -100 },
      follow_up: null,
      target: null,
      flow_id: 'fallback-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [{ message: "Sorry, I didn't understand that.", locale: 'en' }],
        buttons_style: 'button',
        buttons: [],
      },
    },
  ],
  flows: [
    {
      id: 'main-flow',
      name: 'Main',
      start_node_id: 'main-start-node',
    },
    {
      id: 'campaign-1-flow',
      name: 'Summer Sale Campaign',
      start_node_id: 'campaign-1-start-node',
    },
    {
      id: 'campaign-2-flow',
      name: 'Product Launch Campaign',
      start_node_id: 'campaign-2-start-node',
    },
    {
      id: 'fallback-flow',
      name: 'Fallback',
      start_node_id: 'fallback-node',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: [],
  campaigns: [
    {
      id: 'campaign-uuid-1',
      name: 'Summer Sale',
      start_node_id: 'campaign-1-start-node',
    },
    {
      id: 'campaign-uuid-2',
      name: 'Product Launch',
      start_node_id: 'campaign-2-start-node',
    },
  ],
}
