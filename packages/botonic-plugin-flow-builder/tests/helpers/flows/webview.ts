/* eslint-disable @typescript-eslint/naming-convention */
export const webviewFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  hash: '561cf19b9f0f5792721c0c44b126491bc1744930',
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
        x: 286.15775197469156,
        y: 29.987229580114473,
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
        buttons: [
          {
            id: '0198e609-0d72-77c8-89f6-f59e18c0f42e',
            text: [
              {
                message: 'Open webview',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '0198e171-6fd0-77db-9562-19cfa1f2e83c',
              type: 'webview',
            },
            hidden: [],
          },
        ],
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
      id: '0198e171-6fd0-77db-9562-19cfa1f2e83c',
      code: 'OPEN_WEBVIEW_NODE',
      is_code_ai_generated: false,
      meta: {
        x: 657.5,
        y: 292.25,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'webview',
      content: {
        webview_target_id: '0198e171-6fd0-77db-9562-19cfa1f2e83c',
        webview_name: 'Add a bag',
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
  webviews: [
    {
      id: '0198e0ee-592c-71dd-b663-579b1635cb08',
      name: 'Select a seat',
    },
    {
      id: '0198e171-6fd0-77db-9562-19cfa1f2e83c',
      name: 'Flow Builder Webview',
    },
  ],
  webview_contents: [
    {
      id: '0198e11b-a234-747b-add9-b6415b48fe16',
      code: 'HEADER',
      is_code_ai_generated: false,
      meta: {
        x: 426.25,
        y: -7.749999999999986,
      },
      webview_id: '0198e0ee-592c-71dd-b663-579b1635cb08',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Select a seat',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
    {
      id: '0198e171-75c9-754f-a514-250097816efc',
      code: 'HEADER_TEXT',
      is_code_ai_generated: false,
      meta: {
        x: 352.5,
        y: 42.250000000000014,
      },
      webview_id: '0198e171-6fd0-77db-9562-19cfa1f2e83c',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Add a bag',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
    {
      id: '0198e1a1-5df8-727a-9b36-1f32c83dd39f',
      code: 'FOOTER',
      is_code_ai_generated: false,
      meta: {
        x: 668.75,
        y: 317.25,
      },
      webview_id: '0198e0ee-592c-71dd-b663-579b1635cb08',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Close',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
  ],
  bot_variables: [],
}
