export const ratingFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  hash: 'e7920baa9d3538b268c5858b99dd4fbec8dd112c',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: '01971ba0-5dbb-720a-9119-32b2e77e63cf',
  ai_model_id: null,
  is_knowledge_base_active: false,
  is_ai_agent_active: false,
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
          id: '01971ba0-9f92-722d-ba62-c2573a16d989',
          type: 'text',
        },
        second_message: null,
        is_knowledge_base_active: false,
        knowledge_base_followup: null,
      },
    },
    {
      id: '01971ba0-5dbb-720a-9119-32b2e77e63cf',
      code: 'msg-welcome',
      is_code_ai_generated: false,
      meta: {
        x: 303.33546330889027,
        y: -136.94615544733216,
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
      id: '01971ba0-9f92-722d-ba62-c2573a16d989',
      code: 'msg-fallback',
      is_code_ai_generated: false,
      meta: {
        x: 644.3990734393467,
        y: 3.708444135971291,
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
      id: '01977900-f790-75cb-9f21-3dc425be9d27',
      code: 'product_recommender',
      is_code_ai_generated: false,
      meta: {
        x: 311.5384461844489,
        y: -89.33224039644497,
      },
      follow_up: null,
      target: null,
      flow_id: '0a2b5ce4-9cbe-518c-b70c-17544eea0365',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'ai-agent',
      content: {
        name: 'product_recommender',
        instructions: 'instructions',
        active_tools: [
          {
            name: 'get_weather_history',
          },
          {
            name: 'get_date',
          },
          {
            name: 'get_current_weather',
          },
        ],
        sources: [],
      },
    },
    {
      id: '0197f9be-2fa7-762d-b167-e6bff25f2504',
      code: 'low-rating-msg',
      is_code_ai_generated: false,
      meta: {
        x: 389.0153996694076,
        y: 626.7708910573399,
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
            message: 'we will improve',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '0197f9be-5244-767e-a90e-fa2b6a9055fd',
      code: 'heigh-rating-msg',
      is_code_ai_generated: false,
      meta: {
        x: 382.18290993443713,
        y: 487.4487394016003,
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
            message: 'Thanks',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '0197fa11-7ce4-77b0-987e-2319b675628e',
      code: 'test-msg',
      is_code_ai_generated: false,
      meta: {
        x: 397.3700206995859,
        y: 311.1978593207708,
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
            message: 'test follow up',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '019809af-b0cf-75f2-9009-22e651da91c0',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: -216.58750017811258,
        y: 430.773267651215,
      },
      follow_up: null,
      target: {
        id: '01980ec7-88d3-714c-852b-f8878db5adfb',
        type: 'rating',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['rating'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '01980ec7-88d3-714c-852b-f8878db5adfb',
      code: 'agent-rating-msg',
      is_code_ai_generated: false,
      meta: {
        x: 60.0,
        y: 337.3453586092899,
      },
      follow_up: {
        id: '0197fa11-7ce4-77b0-987e-2319b675628e',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'rating',
      content: {
        text: [
          {
            message: 'Rate the human agent',
            locale: 'en',
          },
        ],
        buttons: [
          {
            id: '01980ec7-88d3-714c-852b-fd70729d3c39',
            text: '⭐️ ⭐️ ⭐️ ⭐️ ⭐️',
            payload: 'agent-rating|01980ec7-88d3-714c-852b-fd70729d3c39',
            value: 5,
            target: {
              id: '0197f9be-5244-767e-a90e-fa2b6a9055fd',
              type: 'text',
            },
          },
          {
            id: '01980ec7-88d3-714c-852c-03bc8d6cf3d1',
            text: '⭐️ ⭐️ ⭐️ ⭐️',
            payload: 'agent-rating|01980ec7-88d3-714c-852c-03bc8d6cf3d1',
            value: 4,
            target: {
              id: '0197f9be-5244-767e-a90e-fa2b6a9055fd',
              type: 'text',
            },
          },
          {
            id: '01980ec7-88d3-714c-852c-06a2bb713c77',
            text: '⭐️ ⭐️ ⭐️',
            payload: 'agent-rating|01980ec7-88d3-714c-852c-06a2bb713c77',
            value: 3,
            target: {
              id: '0197f9be-2fa7-762d-b167-e6bff25f2504',
              type: 'text',
            },
          },
          {
            id: '01980ec7-88d3-714c-852c-095ec611b92a',
            text: '⭐️ ⭐️',
            payload: 'agent-rating|01980ec7-88d3-714c-852c-095ec611b92a',
            value: 2,
            target: {
              id: '0197f9be-2fa7-762d-b167-e6bff25f2504',
              type: 'text',
            },
          },
          {
            id: '01980ec7-88d3-714c-852c-0df6b7bffeac',
            text: '⭐️',
            payload: 'agent-rating|01980ec7-88d3-714c-852c-0df6b7bffeac',
            value: 1,
            target: {
              id: '0197f9be-2fa7-762d-b167-e6bff25f2504',
              type: 'text',
            },
          },
        ],
        rating_type: 'stars',
        send_button_text: [
          {
            message: 'Send',
            locale: 'en',
          },
        ],
        open_list_button_text: [
          {
            message: 'Rating Options',
            locale: 'en',
          },
        ],
      },
    },
  ],
  flows: [
    {
      id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      name: 'Main',
      start_node_id: '01971ba0-5dbb-720a-9119-32b2e77e63cf',
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
