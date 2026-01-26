export const captureUserInputFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  hash: '71bc45e9a45a44e09959012a282ce57783197078',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: null,
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
          id: '01971ba0-9f92-722d-ba62-c2573a16d989',
          type: 'text',
        },
        second_message: null,
        is_knowledge_base_active: false,
        knowledge_base_followup: null,
      },
    },
    {
      id: '01971ba0-9f92-722d-ba62-c2573a16d989',
      code: 'fallback-msg',
      is_code_ai_generated: false,
      meta: {
        x: 645.229502073157,
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
      id: '019b0dbc-2d9c-758f-aa2f-3ce92d0e8c5c',
      code: 'yes-follow-up',
      is_code_ai_generated: false,
      meta: {
        x: 722.967740447332,
        y: 46.11369281478835,
      },
      follow_up: null,
      target: null,
      flow_id: '019b07df-3ba4-731a-a42f-a5a6f9f08399',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'siiiiiiii',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: '019b2193-6561-74bc-a77e-df39e2dcc704',
            text: [
              {
                message: 'go to flow',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            phone_number: [],
            target: {
              id: '019b2193-8dc7-723a-b392-63d9b8215b0d',
              type: 'go-to-flow',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: '019b0ddb-7d48-72eb-b44f-84dd1d6dd62b',
      code: 'no-follow-up',
      is_code_ai_generated: false,
      meta: {
        x: 723.75,
        y: 227.25,
      },
      follow_up: null,
      target: null,
      flow_id: '019b07df-3ba4-731a-a42f-a5a6f9f08399',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'nooooooo',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '019b2193-1076-707e-9c3f-b9d3fdc8b4da',
      code: 'campaign follow up',
      is_code_ai_generated: false,
      meta: {
        x: 758.2652789989555,
        y: -201.930591661534,
      },
      follow_up: null,
      target: null,
      flow_id: '019b07df-3ba4-731a-a42f-a5a6f9f08399',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'campaign follow up',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '019b2193-8dc7-723a-b392-63d9b8215b0d',
      code: 'Go to flow|019b2193-8dc7-723a-b392-63d9b8215b0d',
      is_code_ai_generated: false,
      meta: {
        x: 1060.1788741395455,
        y: 114.4171195813952,
      },
      follow_up: null,
      target: null,
      flow_id: '019b07df-3ba4-731a-a42f-a5a6f9f08399',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'go-to-flow',
      content: {
        flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      },
    },
    {
      id: '019bbd18-1b72-71a1-9197-c3a20d58f7f1',
      code: 'capture-input-node',
      is_code_ai_generated: false,
      meta: {
        x: 779.8082675743995,
        y: 259.86219014026653,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'capture-user-input',
      content: {
        field_name: 'booking_number',
        ai_validation_type: 'custom',
        ai_validation_instructions:
          'booking number is an alphanumeric string that start with 3 letters followed by 4 number',
        capture_success: {
          id: '019bbd1e-10dd-752f-afe9-59b6f902ac28',
          type: 'text',
        },
        capture_fail: {
          id: '019bbd1e-189a-72f3-907c-e2bda60faed0',
          type: 'text',
        },
      },
    },
    {
      id: '019bbd1d-aec5-7614-b500-df8631992263',
      code: 'WHAT_IS_YOUR_SURNAME',
      is_code_ai_generated: true,
      meta: {
        x: 437.5,
        y: 309.7499999999999,
      },
      follow_up: {
        id: '019bbd18-1b72-71a1-9197-c3a20d58f7f1',
        type: 'capture-user-input',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'What is your booking number?',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '019bbd1e-10dd-752f-afe9-59b6f902ac28',
      code: 'CAPTURE_SUCCESS',
      is_code_ai_generated: true,
      meta: {
        x: 1112.5,
        y: 253.5,
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
            message: 'capture success',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '019bbd1e-189a-72f3-907c-e2bda60faed0',
      code: 'CAPTURE_FAIL',
      is_code_ai_generated: true,
      meta: {
        x: 1043.75,
        y: 551.0,
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
            message: 'capture fail',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '019bc2d7-4dc6-71db-bf6e-0f3794c6a984',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 801.25,
        y: 67.25,
      },
      follow_up: null,
      target: {
        id: '019bbd1e-10dd-752f-afe9-59b6f902ac28',
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
            values: ['success'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '019bbd1d-9f04-7159-9c0c-179e056a2670',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 46.25,
        y: 440.9999999999999,
      },
      follow_up: null,
      target: {
        id: '019bbd1d-aec5-7614-b500-df8631992263',
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
            values: ['capture'],
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
      start_node_id: null,
    },
    {
      id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      name: 'Fallback',
      start_node_id: 'f3931bce-7de3-5c7a-8287-81f0292ee4f3',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: ['booking_number'],
  campaigns: [],
}
