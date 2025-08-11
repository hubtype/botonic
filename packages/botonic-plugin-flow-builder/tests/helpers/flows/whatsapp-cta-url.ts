export const whatsappCtaUrlFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  hash: 'afa5e9b691c86c2766efedb3a190d45eb1201758',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: '01971ba0-5dbb-720a-9119-32b2e77e63cf',
  ai_model_id: null,
  is_knowledge_base_active: false,
  is_ai_agent_active: false,
  nodes: [
    {
      id: '0198648f-c813-702d-a63d-dcdf8b67c356',
      type: 'url',
      content: {
        url: 'https://www.hubtype.com',
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
        x: 284.90775197469156,
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
      id: '01985b9b-1a23-7720-bdcd-76e4b582f2f5',
      code: 'image-cta-url-msg',
      is_code_ai_generated: false,
      meta: {
        x: 366.8167778646026,
        y: 272.2345903482479,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-cta-url-button',
      content: {
        text: [
          {
            message: 'Main text for cta url message',
            locale: 'en',
          },
        ],
        header_type: 'image',
        header: [],
        header_image: [
          {
            id: '0198648e-8d39-71aa-bc30-fe2d14ddaefd',
            file: 'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/dragon_ball_walpaper.jpg',
            locale: 'en',
          },
        ],
        header_video: [],
        header_document: [],
        footer: [
          {
            message: 'Footer text for cta url message',
            locale: 'en',
          },
        ],
        button: {
          id: '01985b9b-1a23-7720-bdcd-731787a89b04',
          text: [
            {
              message: 'open',
              locale: 'en',
            },
          ],
          url: [
            {
              id: '0198648f-c813-702d-a63d-dcdf8b67c356',
              locale: 'en',
            },
          ],
          payload: [],
          target: null,
          hidden: [],
        },
      },
    },
    {
      id: '0198648d-bc40-7339-9e5d-937410f8940d',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: -17.5,
        y: 322.25,
      },
      follow_up: null,
      target: {
        id: '01985b9b-1a23-7720-bdcd-76e4b582f2f5',
        type: 'whatsapp-cta-url-button',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['imageCtaUrl'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '01986491-1c20-726c-8b74-e4f97013cfc6',
      code: 'video-cta-url-msg',
      is_code_ai_generated: false,
      meta: {
        x: 384.3167778646026,
        y: 732.2345903482478,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-cta-url-button',
      content: {
        text: [
          {
            message: 'Main text for cta url message',
            locale: 'en',
          },
        ],
        header_type: 'video',
        header: [],
        header_image: [],
        header_video: [
          {
            id: '01986491-7bc5-75ab-8feb-96400fe29eea',
            file: 'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/video_test.mp4',
            locale: 'en',
          },
        ],
        header_document: [],
        footer: [
          {
            message: 'Footer text for cta url message',
            locale: 'en',
          },
        ],
        button: {
          id: '01986491-1c20-726c-8b74-ea2ba20966f7',
          text: [
            {
              message: 'open',
              locale: 'en',
            },
          ],
          url: [
            {
              id: '0198648f-c813-702d-a63d-dcdf8b67c356',
              locale: 'en',
            },
          ],
          payload: [],
          target: null,
          hidden: [],
        },
      },
    },
    {
      id: '01986491-1c20-726c-8b74-f39682d95bb6',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 0.0,
        y: 782.25,
      },
      follow_up: null,
      target: {
        id: '01986491-1c20-726c-8b74-e4f97013cfc6',
        type: 'whatsapp-cta-url-button',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['videoCtaUrl'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '01986491-bec1-70e9-b86f-d5c6d2ed7332',
      code: 'document-cta-url-msg',
      is_code_ai_generated: false,
      meta: {
        x: 1029.7499999999998,
        y: 497.5,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-cta-url-button',
      content: {
        text: [
          {
            message: 'Main text for cta url message',
            locale: 'en',
          },
        ],
        header_type: 'document',
        header: [],
        header_image: [],
        header_video: [],
        header_document: [
          {
            id: '01986493-6091-74bd-8313-13f8989593e7',
            file: 'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/requisitos_cta_url_whatsapp.pdf',
            locale: 'en',
          },
        ],
        footer: [
          {
            message: 'Footer text for cta url message',
            locale: 'en',
          },
        ],
        button: {
          id: '01986491-bec1-70e9-b86f-db2127b3ad48',
          text: [
            {
              message: 'open',
              locale: 'en',
            },
          ],
          url: [
            {
              id: '0198648f-c813-702d-a63d-dcdf8b67c356',
              locale: 'en',
            },
          ],
          payload: [],
          target: null,
          hidden: [],
        },
      },
    },
    {
      id: '01986491-bec1-70e9-b86f-e3e2b95d4d7e',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 637.9332221353972,
        y: 130.01540965175218,
      },
      follow_up: null,
      target: {
        id: '01986492-2762-77aa-907e-cbfc9b316e80',
        type: 'whatsapp-cta-url-button',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['ctaUrl'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '01986492-2762-77aa-907e-cbfc9b316e80',
      code: 'cta-url-msg',
      is_code_ai_generated: false,
      meta: {
        x: 1010.9999999999998,
        y: 102.25,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-cta-url-button',
      content: {
        text: [
          {
            message: 'Main text for cta url message',
            locale: 'en',
          },
        ],
        header_type: 'text',
        header: [],
        header_image: [],
        header_video: [],
        header_document: [],
        footer: [],
        button: {
          id: '01986492-2762-77aa-907e-c730d715c1fe',
          text: [
            {
              message: 'open',
              locale: 'en',
            },
          ],
          url: [
            {
              id: '0198648f-c813-702d-a63d-dcdf8b67c356',
              locale: 'en',
            },
          ],
          payload: [],
          target: null,
          hidden: [],
        },
      },
    },
    {
      id: '01986492-cabb-7249-9767-753716261a34',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 680.9999999999998,
        y: 507.24999999999994,
      },
      follow_up: null,
      target: {
        id: '01986491-bec1-70e9-b86f-d5c6d2ed7332',
        type: 'whatsapp-cta-url-button',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['documentCtaUrl'],
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
