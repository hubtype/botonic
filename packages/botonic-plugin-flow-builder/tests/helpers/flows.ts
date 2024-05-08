/* eslint-disable @typescript-eslint/naming-convention */
export const testFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  locales: ['es'],
  start_node_id: '607205c9-6814-45ba-9aeb-2dd08d0cb529',
  ai_model_id: null,
  nodes: [
    {
      id: 'f0ceef47-16a9-49b6-ab30-1ba0f5127ab2',
      type: 'payload',
      content: {
        payload: 'rating',
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
      type: 'fallback',
      content: {
        first_message: {
          id: '802474a3-cb77-45a9-bff5-ca5eb762eb78',
          type: 'text',
        },
        second_message: null,
        is_knowledge_base_active: true,
        knowledge_base_followup: {
          id: 'c8665d3d-a61c-4f29-a9cc-22217db6def4',
          type: 'text',
        },
      },
    },
    {
      id: '607205c9-6814-45ba-9aeb-2dd08d0cb529',
      code: 'WELCOME',
      is_code_ai_generated: false,
      meta: {
        x: 382.5,
        y: 4.750000000000014,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'Welcome message',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '802474a3-cb77-45a9-bff5-ca5eb762eb78',
      code: '1ST_FALLBACK',
      is_code_ai_generated: false,
      meta: {
        x: 682.5,
        y: 67.25000000000001,
      },
      follow_up: null,
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      type: 'text',
      content: {
        text: [
          {
            message: 'fallback 1st message',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'c8665d3d-a61c-4f29-a9cc-22217db6def4',
      code: 'KnowledeBase FU',
      is_code_ai_generated: false,
      meta: {
        x: 710.0,
        y: -106.5,
      },
      follow_up: null,
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message after knowledge base',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '8b0c87c0-77b2-4b05-bae0-3b353240caaa',
      code: 'Rating#1',
      is_code_ai_generated: false,
      meta: {
        x: 562.423575856037,
        y: 285.29363701139494,
      },
      follow_up: {
        id: 'aa316c3c-db3c-4538-a57a-a63fed919862',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'bot-action',
      content: {
        payload_id: 'f0ceef47-16a9-49b6-ab30-1ba0f5127ab2',
        payload_params: '{"value": 1}',
      },
    },
    {
      id: 'aa316c3c-db3c-4538-a57a-a63fed919862',
      code: 'SORRY',
      is_code_ai_generated: false,
      meta: {
        x: 935.735851137171,
        y: 349.1819952529043,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'Sorry, we will continue to improve',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '386ba508-a3b3-49a2-94d0-5e239ba63106',
      code: 'RATING_MESSAGE',
      is_code_ai_generated: false,
      meta: {
        x: 232.5,
        y: 302.25,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'Can you rate the attention received by the agent?',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: '92f9800e-3b89-41f2-92ec-71c3de5a8621',
            text: [
              {
                message: '\u2b50\ufe0f',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '8b0c87c0-77b2-4b05-bae0-3b353240caaa',
              type: 'bot-action',
            },
            hidden: [],
          },
          {
            id: '0231e03f-78e4-4798-8f65-677dac44c9d6',
            text: [
              {
                message: '\u2b50\ufe0f\u2b50\ufe0f',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'fb383a44-db8a-4312-9cd5-cce8841d886f',
              type: 'bot-action',
            },
            hidden: [],
          },
          {
            id: 'bd3947cb-6916-4822-b490-94a7f831b895',
            text: [
              {
                message: '\u2b50\ufe0f\u2b50\ufe0f\u2b50\ufe0f',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '2acd91ba-8a08-42e2-a723-89820839e972',
              type: 'bot-action',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: '51e14949-15cd-491d-9f76-b5370ea0b8ce',
      code: 'THNAKS',
      is_code_ai_generated: false,
      meta: {
        x: 903.75,
        y: 574.7499999999999,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'Thank you',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'fb383a44-db8a-4312-9cd5-cce8841d886f',
      code: 'Rating#2',
      is_code_ai_generated: false,
      meta: {
        x: 552.423575856037,
        y: 462.79363701139494,
      },
      follow_up: {
        id: 'aa316c3c-db3c-4538-a57a-a63fed919862',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'bot-action',
      content: {
        payload_id: 'f0ceef47-16a9-49b6-ab30-1ba0f5127ab2',
        payload_params: '{"value": 2}',
      },
    },
    {
      id: '2acd91ba-8a08-42e2-a723-89820839e972',
      code: 'Rating#3',
      is_code_ai_generated: false,
      meta: {
        x: 564.923575856037,
        y: 658.0436370113949,
      },
      follow_up: {
        id: '51e14949-15cd-491d-9f76-b5370ea0b8ce',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'bot-action',
      content: {
        payload_id: 'f0ceef47-16a9-49b6-ab30-1ba0f5127ab2',
        payload_params: '{"value": 3}',
      },
    },
  ],
  flows: [
    {
      id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      name: 'Main',
      start_node_id: '607205c9-6814-45ba-9aeb-2dd08d0cb529',
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
