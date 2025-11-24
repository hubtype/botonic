export const openWebviewFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  hash: '6c54a5c88c0e0129b69d36a00be3833fda099101',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: '0199102a-01e4-776d-b696-a4489e4cc644',
  ai_model_id: null,
  is_knowledge_base_active: false,
  is_ai_agent_active: false,
  nodes: [
    {
      id: '019aa1ae-b870-769e-b063-216c62da41e7',
      type: 'payload',
      content: {
        payload: 'WELCOME_PAYLOAD',
      },
    },
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
          id: '0199102a-3fc4-72ee-bc1e-67a8f1272c82',
          type: 'text',
        },
        second_message: null,
        is_knowledge_base_active: false,
        knowledge_base_followup: null,
      },
    },
    {
      id: '0199102a-01e4-776d-b696-a4489e4cc644',
      code: 'welcome-msg',
      is_code_ai_generated: false,
      meta: {
        x: 435.0,
        y: 51.000000000000014,
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
            id: '019ab584-b72a-721e-bc9c-9ec47bf8f589',
            text: [
              {
                message: 'webview',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '019ab584-d30d-777f-bfb2-2912f74744dc',
              type: 'webview',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: '0199102a-3fc4-72ee-bc1e-67a8f1272c82',
      code: 'fallback-msg',
      is_code_ai_generated: false,
      meta: {
        x: 741.25,
        y: 72.25,
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
      id: '019ab584-d30d-777f-bfb2-2912f74744dc',
      code: 'TestWebview',
      is_code_ai_generated: false,
      meta: {
        x: 831.784297414834,
        y: 116.33452080401645,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'webview',
      content: {
        webview_target_id: '0199102d-90b9-771d-a927-7329bd348a5e',
        webview_name: 'TestWebview',
        webview_component_name: 'Testwebview',
        exits: [
          {
            id: '019ab584-d30d-777f-bfb2-2f6d845ee89f',
            name: 'Success',
            target: null,
          },
        ],
      },
    },
  ],
  flows: [
    {
      id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      name: 'Main',
      start_node_id: '0199102a-01e4-776d-b696-a4489e4cc644',
    },
    {
      id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      name: 'Fallback',
      start_node_id: 'f3931bce-7de3-5c7a-8287-81f0292ee4f3',
    },
  ],
  webviews: [
    {
      id: '0199102d-90b9-771d-a927-7329bd348a5e',
      name: 'TestWebview',
      component_name: 'Testwebview',
    },
  ],
  webview_contents: [
    {
      id: '0199102d-9756-72c9-911d-c434e0686546',
      code: 'HEADER',
      is_code_ai_generated: false,
      meta: {
        x: 387.5,
        y: 83.50000000000001,
      },
      webview_id: '0199102d-90b9-771d-a927-7329bd348a5e',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Title Test Webview',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
  ],
  bot_variables: ['bookingNumber', 'isLogged', 'numberOfBags'],
}
