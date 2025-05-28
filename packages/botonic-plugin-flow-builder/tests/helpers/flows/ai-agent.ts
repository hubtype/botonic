/* eslint-disable @typescript-eslint/naming-convention */
export const aiAgentTestFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  hash: 'a1faea73103bf18dde342a81e2378d916ae4dc6c',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: '0196f201-fdde-721c-b24a-2659cc5b82b7',
  ai_model_id: null,
  is_knowledge_base_active: false,
  is_ai_agent_active: true,
  nodes: [
    {
      id: 'f3931bce-7de3-5c7a-8287-81f0292ee4f3',
      code: 'Fallback',
      is_code_ai_generated: false,
      meta: {
        x: 300.0,
        y: 0.0,
      },
      follow_up: null,
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'fallback',
      content: {
        first_message: {
          id: '0196f202-451f-7394-921b-16ad58da9bd6',
          type: 'text',
        },
        second_message: null,
        is_knowledge_base_active: false,
        knowledge_base_followup: null,
      },
    },
    {
      id: '0196f201-fdde-721c-b24a-2659cc5b82b7',
      code: 'msg-welcome',
      is_code_ai_generated: false,
      meta: {
        x: 646.25,
        y: -20.249999999999986,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'Welcome',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '0196f202-451f-7394-921b-16ad58da9bd6',
      code: 'msg-fallback',
      is_code_ai_generated: false,
      meta: {
        x: 617.5,
        y: 26.000000000000014,
      },
      follow_up: null,
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'Fallback',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '0196f202-a5ea-713e-a3f9-287cf8f0303a',
      code: 'weather-agent',
      is_code_ai_generated: false,
      meta: {
        x: 395.0,
        y: -11.499999999999986,
      },
      follow_up: null,
      target: null,
      flow_id: '0a2b5ce4-9cbe-518c-b70c-17544eea0365',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'ai-agent',
      content: {
        name: 'Weather Agent',
        instructions:
          "You're a weather agent that answer queries regarding temperature and raining probability.",
      },
    },
    {
      id: '0196f211-c045-77c6-a9e9-f0c33c5f77cc',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: -33.75,
        y: -156.49999999999997,
      },
      follow_up: null,
      target: {
        id: '0196f213-03ac-7758-9ace-a59d600f1ae0',
        type: 'text',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['Hello'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '0196f213-03ac-7758-9ace-a59d600f1ae0',
      code: 'msg-keywords-trigger',
      is_code_ai_generated: false,
      meta: {
        x: 351.25,
        y: -225.24999999999997,
      },
      follow_up: {
        id: '0196f201-fdde-721c-b24a-2659cc5b82b7',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'keywords trigger',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
  ],
  flows: [
    {
      id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      name: 'Main',
      start_node_id: '0196f201-fdde-721c-b24a-2659cc5b82b7',
    },
    {
      id: '0a2b5ce4-9cbe-518c-b70c-17544eea0365',
      name: 'AI agents',
      start_node_id: '0196f202-a5ea-713e-a3f9-287cf8f0303a',
    },
    {
      id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      name: 'Fallback',
      start_node_id: 'f3931bce-7de3-5c7a-8287-81f0292ee4f3',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: [],
}
