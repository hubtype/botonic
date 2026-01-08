export const openWebviewFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  hash: 'fe21a91c6a7e9460241568628422423cbced2651',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: '0199102a-01e4-776d-b696-a4489e4cc644',
  ai_model_id: null,
  is_knowledge_base_active: false,
  is_ai_agent_active: false,
  nodes: [
    {
      id: '0199bdc4-9d72-73ae-9945-d2bb1df4a420',
      type: 'url',
      content: {
        url: 'https://www.hubtype.com',
      },
    },
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
      id: '019a97e5-1ad5-7046-93e8-fd8498869c35',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 76.25,
        y: -171.49999999999997,
      },
      follow_up: null,
      target: {
        id: '0199102a-01e4-776d-b696-a4489e4cc644',
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
            values: ['hola'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '019ab584-d30d-777f-bfb2-2912f74744dc',
      code: 'Test Webview',
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
    {
      id: '019ab5a0-f006-775a-96e3-3c525d60e977',
      code: 'Carousel',
      is_code_ai_generated: false,
      meta: {
        x: 127.5,
        y: 314.74999999999994,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'carousel',
      content: {
        whatsapp_text: [],
        elements: [
          {
            id: '019ab5a0-f006-775a-96e3-39a5ac060e84',
            title: [
              {
                message: 'Element with a webview button',
                locale: 'en',
              },
            ],
            subtitle: [],
            image: [
              {
                id: '019ab5a2-205b-711a-9a71-17cf7325b9a8',
                file: 'https://medias.ent0.flowbuilder.prod.hubtype.com/assets/media_files/825f22e5-421e-4d8d-bdd9-2fb9c6f6e4cb/01991029-e8a2-7c31-b581-ba15d48fa1df/truth.png',
                locale: 'en',
              },
            ],
            button: {
              id: '019ab5a0-f006-775a-96e3-3459a2767ee5',
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
          },
          {
            id: '019ab5a3-93b4-7446-b000-251f1d6606d5',
            title: [
              {
                message: 'Hubtype url',
                locale: 'en',
              },
            ],
            subtitle: [],
            image: [
              {
                id: '019ab5a4-c7f8-7418-a55f-b6b7e5910749',
                file: 'https://medias.ent0.flowbuilder.prod.hubtype.com/assets/media_files/825f22e5-421e-4d8d-bdd9-2fb9c6f6e4cb/01991029-e8a2-7c31-b581-ba15d48fa1df/hubtype.png',
                locale: 'en',
              },
            ],
            button: {
              id: '019ab5a3-93b4-7446-b000-20c03af4a877',
              text: [
                {
                  message: 'hubtype',
                  locale: 'en',
                },
              ],
              url: [
                {
                  id: '0199bdc4-9d72-73ae-9945-d2bb1df4a420',
                  locale: 'en',
                },
              ],
              payload: [],
              target: null,
              hidden: [],
            },
          },
        ],
      },
    },
    {
      id: '019ab5a2-3b13-72dc-bf9a-81641423edd6',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: -190.0,
        y: 394.75,
      },
      follow_up: null,
      target: {
        id: '019ab5a0-f006-775a-96e3-3c525d60e977',
        type: 'carousel',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['carousel'],
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
