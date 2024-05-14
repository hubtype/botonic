/* eslint-disable @typescript-eslint/naming-convention */
export const basicFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  locales: ['en'],
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
        second_message: {
          id: '731b6a73-dba9-4757-9243-782170640d9c',
          type: 'text',
        },
        is_knowledge_base_active: false,
        knowledge_base_followup: null,
      },
    },
    {
      id: '607205c9-6814-45ba-9aeb-2dd08d0cb529',
      code: 'WELCOME',
      is_code_ai_generated: false,
      meta: {
        x: 578.2893680449249,
        y: -59.064755572047886,
      },
      follow_up: {
        id: '193bb98a-5ff0-45c3-85d6-8026711c7cd7',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'Welcome message',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '802474a3-cb77-45a9-bff5-ca5eb762eb78',
      code: '1ST_FALLBACK_MSG',
      is_code_ai_generated: false,
      meta: {
        x: 660.6877311440156,
        y: -54.642090665795266,
      },
      follow_up: null,
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      type: 'text',
      content: {
        text: [
          {
            message: 'fallback 1st message',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '85dbeb56-81c9-419d-a235-4ebf491b4fc9',
      code: 'Rating#1',
      is_code_ai_generated: false,
      meta: {
        x: 669.0628616420411,
        y: -92.97367038402388,
      },
      follow_up: {
        id: '4be63fbe-0797-4074-ba93-9e9354dfc0f7',
        type: 'text',
      },
      target: null,
      flow_id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      type: 'bot-action',
      content: {
        payload_id: 'f0ceef47-16a9-49b6-ab30-1ba0f5127ab2',
        payload_params: '{"value": 1}',
      },
    },
    {
      id: '4be63fbe-0797-4074-ba93-9e9354dfc0f7',
      code: 'SORRY',
      is_code_ai_generated: false,
      meta: {
        x: 1042.375136923175,
        y: -29.08531214251451,
      },
      follow_up: null,
      target: null,
      flow_id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      type: 'text',
      content: {
        text: [
          {
            message: 'Sorry, we will continue to improve',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '578b30eb-d230-4162-8a36-6c7fa18ff0db',
      code: 'RATING_MESSAGE',
      is_code_ai_generated: false,
      meta: {
        x: 339.139285786004,
        y: -76.01730739541881,
      },
      follow_up: null,
      target: null,
      flow_id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      type: 'text',
      content: {
        text: [
          {
            message: 'Can you rate the attention received by the agent?',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: 'c8cfa118-058c-4fb7-8928-7f9660ab2648',
            text: [
              {
                message: '\u2b50\ufe0f',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '85dbeb56-81c9-419d-a235-4ebf491b4fc9',
              type: 'bot-action',
            },
            hidden: [],
          },
          {
            id: '9e9561fa-9009-44ca-8098-e5bdd5bd2920',
            text: [
              {
                message: '\u2b50\ufe0f\u2b50\ufe0f',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'f474eaf5-0e95-4c27-84e4-9b0710988048',
              type: 'bot-action',
            },
            hidden: [],
          },
          {
            id: '4cce145b-aa08-4dca-a2d3-3f861f87fb47',
            text: [
              {
                message: '\u2b50\ufe0f\u2b50\ufe0f\u2b50\ufe0f',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '1aac2d35-69c1-4c6f-9ad7-6af930088474',
              type: 'bot-action',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: 'd5f6b8f2-e704-4013-aa6e-fd1f571061c4',
      code: 'THNAKS',
      is_code_ai_generated: false,
      meta: {
        x: 1010.3892857860042,
        y: 196.48269260458108,
      },
      follow_up: null,
      target: null,
      flow_id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      type: 'text',
      content: {
        text: [
          {
            message: 'Thank you',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'f474eaf5-0e95-4c27-84e4-9b0710988048',
      code: 'Rating#2',
      is_code_ai_generated: false,
      meta: {
        x: 659.0628616420411,
        y: 84.52632961597612,
      },
      follow_up: {
        id: '4be63fbe-0797-4074-ba93-9e9354dfc0f7',
        type: 'text',
      },
      target: null,
      flow_id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      type: 'bot-action',
      content: {
        payload_id: 'f0ceef47-16a9-49b6-ab30-1ba0f5127ab2',
        payload_params: '{"value": 2}',
      },
    },
    {
      id: '1aac2d35-69c1-4c6f-9ad7-6af930088474',
      code: 'Rating#3',
      is_code_ai_generated: false,
      meta: {
        x: 671.5628616420411,
        y: 279.7763296159761,
      },
      follow_up: {
        id: 'd5f6b8f2-e704-4013-aa6e-fd1f571061c4',
        type: 'text',
      },
      target: null,
      flow_id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      type: 'bot-action',
      content: {
        payload_id: 'f0ceef47-16a9-49b6-ab30-1ba0f5127ab2',
        payload_params: '{"value": 3}',
      },
    },
    {
      id: '0d3fa83b-8d69-45bd-982a-fbcbfb83a28c',
      code: 'KEYWORD_WELCOME',
      is_code_ai_generated: false,
      meta: {
        x: 153.3970670849917,
        y: -309.7586153206594,
      },
      follow_up: null,
      target: {
        id: '607205c9-6814-45ba-9aeb-2dd08d0cb529',
        type: 'text',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'keyword',
      content: {
        title: [
          {
            message: '',
            locale: 'en',
          },
        ],
        keywords: [
          {
            values: ['reset', '/hola/i'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '193bb98a-5ff0-45c3-85d6-8026711c7cd7',
      code: 'MAIN_MENU',
      is_code_ai_generated: false,
      meta: {
        x: 916.045332021919,
        y: -112.6957963318124,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'How can I help you?',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: 'fe234057-5a22-4d96-9893-b4472143310c',
            text: [
              {
                message: 'Add a bag',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'a91c0bca-c213-4693-b3bd-f091fcbf445c',
              type: 'text',
            },
            hidden: [],
          },
          {
            id: '98354ca1-c071-4007-8c51-a4261339fb85',
            text: [
              {
                message: 'Select a seat',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '59071c29-2cd7-447a-b290-04269b76701d',
              type: 'text',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: 'a91c0bca-c213-4693-b3bd-f091fcbf445c',
      code: 'ADD_BAG_MSG',
      is_code_ai_generated: false,
      meta: {
        x: 1286.1328324748395,
        y: -137.19120253474404,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message explaining how to add a bag',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '59071c29-2cd7-447a-b290-04269b76701d',
      code: 'SELECT_SEAT_MSG',
      is_code_ai_generated: false,
      meta: {
        x: 1257.2104317972348,
        y: 93.11680286099826,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message explaining how to select a seat',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '731b6a73-dba9-4757-9243-782170640d9c',
      code: '2ND_FALLBACK_MSG',
      is_code_ai_generated: false,
      meta: {
        x: 640.1186260217131,
        y: 114.68385072282541,
      },
      follow_up: null,
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      type: 'text',
      content: {
        text: [
          {
            message: 'fallback 2nd message',
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
      start_node_id: '607205c9-6814-45ba-9aeb-2dd08d0cb529',
    },
    {
      id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      name: 'Fallback',
      start_node_id: 'f3931bce-7de3-5c7a-8287-81f0292ee4f3',
    },
    {
      id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      name: 'Rating',
      start_node_id: '578b30eb-d230-4162-8a36-6c7fa18ff0db',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: [],
}
