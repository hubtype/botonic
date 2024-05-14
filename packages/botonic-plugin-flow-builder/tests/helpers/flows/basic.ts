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
      code: '',
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
          {
            id: '9c559702-7e4a-48ed-9a01-193a0826c256',
            text: [
              {
                message: 'Talk to an agent',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'a73869bf-ddb0-4c15-b44b-fc152cb9a910',
              type: 'go-to-flow',
            },
            hidden: [],
          },
          {
            id: 'c1628dd4-d434-46e4-a640-b2fc3c5dfe5e',
            text: [
              {
                message: 'Conditionals',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '5042e484-b0b8-412c-9b2a-8768828653b7',
              type: 'go-to-flow',
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
        x: 1280.4629164691908,
        y: -173.10067057051984,
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
        x: 1485.5446400345668,
        y: -33.65734385216269,
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
    {
      id: 'fdeb8bdf-73f2-42c4-bc0f-14ebca84e507',
      code: 'SERVED_BY_HUMAN_AGENT',
      is_code_ai_generated: true,
      meta: {
        x: 493.62603481718014,
        y: -12.477605392762399,
      },
      follow_up: {
        id: '07947391-3460-45fb-a195-2c2e12483ad3',
        type: 'handoff',
      },
      target: null,
      flow_id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      type: 'text',
      content: {
        text: [
          {
            message: 'Soon you will be served by a human agent',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '07947391-3460-45fb-a195-2c2e12483ad3',
      code: 'HANDOFF_47',
      is_code_ai_generated: true,
      meta: {
        x: 807.5515323546948,
        y: 11.1258154747199,
      },
      follow_up: null,
      target: {
        id: '0a2a0929-c694-4c5c-9a81-863d20eee1a6',
        type: 'go-to-flow',
      },
      flow_id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      type: 'handoff',
      content: {
        queue: [
          {
            id: 'e7a2304d-f73c-409d-b272-239a9b8a9e0e',
            name: 'General',
            locale: 'en',
          },
        ],
        payload: [],
        has_auto_assign: false,
      },
    },
    {
      id: '0a2a0929-c694-4c5c-9a81-863d20eee1a6',
      code: 'Go to flow',
      is_code_ai_generated: false,
      meta: {
        x: 1208.8096871018943,
        y: 41.81026260244691,
      },
      follow_up: null,
      target: null,
      flow_id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      type: 'go-to-flow',
      content: {
        flow_id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      },
    },
    {
      id: '3b363ae7-c7e5-4e6a-9df0-333cb2667637',
      code: 'QUEUE-STATUS_48',
      is_code_ai_generated: true,
      meta: {
        x: 187.96173458328417,
        y: -75.02667069159055,
      },
      follow_up: null,
      target: null,
      flow_id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      type: 'function',
      content: {
        action: 'check-queue-status',
        arguments: [
          {
            locale: 'en',
            values: [
              {
                type: 'string',
                name: 'queue_id',
                value: 'e7a2304d-f73c-409d-b272-239a9b8a9e0e',
              },
              {
                type: 'string',
                name: 'queue_name',
                value: 'General',
              },
            ],
          },
          {
            type: 'boolean',
            name: 'check_available_agents',
            value: false,
          },
        ],
        result_mapping: [
          {
            result: 'open',
            target: {
              id: 'fdeb8bdf-73f2-42c4-bc0f-14ebca84e507',
              type: 'text',
            },
          },
          {
            result: 'closed',
            target: {
              id: '9e434de0-9974-430f-aa16-43149a3c6410',
              type: 'text',
            },
          },
          {
            result: 'open-without-agents',
            target: null,
          },
        ],
      },
    },
    {
      id: '9e434de0-9974-430f-aa16-43149a3c6410',
      code: 'OUT_OF_OFFICE',
      is_code_ai_generated: true,
      meta: {
        x: 508.9682583810436,
        y: 190.51181406758548,
      },
      follow_up: null,
      target: null,
      flow_id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      type: 'text',
      content: {
        text: [
          {
            message: 'At the moment we are out of office hours',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'a73869bf-ddb0-4c15-b44b-fc152cb9a910',
      code: 'Go to flow',
      is_code_ai_generated: false,
      meta: {
        x: 1295.1918469492387,
        y: 106.09766446464303,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'go-to-flow',
      content: {
        flow_id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      },
    },
    {
      id: 'a0950e26-db42-4b16-91a3-d575db79bced',
      code: '',
      is_code_ai_generated: true,
      meta: {
        x: -116.59763102117329,
        y: -253.0023061157998,
      },
      follow_up: null,
      target: {
        id: '3b363ae7-c7e5-4e6a-9df0-333cb2667637',
        type: 'function',
      },
      flow_id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
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
            values: ['agent'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '7f6935df-4dab-42b9-a6f5-2f81e965cf75',
      code: 'CHECK_CONDITIONALS',
      is_code_ai_generated: true,
      meta: {
        x: 231.69008633045542,
        y: -74.35932804519047,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'text',
      content: {
        text: [
          {
            message: 'Check diferents conditionals',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: '7cec6bb9-32bb-43a7-8936-b4589b22a8f1',
            text: [
              {
                message: 'Channel',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'ddaf7bf5-0677-4a59-89e0-c3859a6fb7ce',
              type: 'function',
            },
            hidden: [],
          },
          {
            id: '439c51ae-56b5-43d4-bda0-296493620215',
            text: [
              {
                message: 'Country',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'c16d06b0-7b05-4771-94fe-065357bd6407',
              type: 'function',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: 'ddaf7bf5-0677-4a59-89e0-c3859a6fb7ce',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 522.8059647755006,
        y: -481.84993175360717,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'function',
      content: {
        action: 'get-channel-type',
        arguments: [],
        result_mapping: [
          {
            result: 'default',
            target: {
              id: '4262525b-0e4f-4090-9356-9f892d938cf7',
              type: 'text',
            },
          },
          {
            result: 'whatsapp',
            target: {
              id: '60e9d0e0-7dd4-4f2a-b30f-298937719c25',
              type: 'text',
            },
          },
          {
            result: 'telegram',
            target: {
              id: 'c9a20d87-9b2c-455d-a31b-ded33d756847',
              type: 'text',
            },
          },
        ],
      },
    },
    {
      id: '60e9d0e0-7dd4-4f2a-b30f-298937719c25',
      code: 'MESSAGE_ONLY_FOR_WHATSAPP',
      is_code_ai_generated: true,
      meta: {
        x: 848.8893348035837,
        y: -537.2279171376994,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message only for WhatsApp',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'c9a20d87-9b2c-455d-a31b-ded33d756847',
      code: 'TELEGRAM_MESSAGE_ONLY',
      is_code_ai_generated: true,
      meta: {
        x: 854.1559846947492,
        y: -398.71523156558305,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message only for Telegram',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '4262525b-0e4f-4090-9356-9f892d938cf7',
      code: 'OTHER_CHANNELS_MESSAGE',
      is_code_ai_generated: true,
      meta: {
        x: 858.5649161830746,
        y: -278.76520914929284,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message for other channels',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'c16d06b0-7b05-4771-94fe-065357bd6407',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 532.667540170762,
        y: 223.77259352036748,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'function',
      content: {
        action: 'check-country',
        arguments: [],
        result_mapping: [
          {
            result: 'default',
            target: {
              id: '1706adbc-31cd-4cc9-add3-901f41a956a8',
              type: 'text',
            },
          },
          {
            result: 'ES',
            target: {
              id: '95dc17c7-c3b3-419d-948c-85c5b05392d9',
              type: 'text',
            },
          },
          {
            result: 'FR',
            target: {
              id: 'f4af1955-8621-44ed-93f1-68498499adac',
              type: 'text',
            },
          },
          {
            result: 'GB',
            target: {
              id: '598ca5e5-56ac-4f58-8727-27f4507375f0',
              type: 'text',
            },
          },
        ],
      },
    },
    {
      id: '95dc17c7-c3b3-419d-948c-85c5b05392d9',
      code: 'SPAIN_MESSAGE_ONLY',
      is_code_ai_generated: true,
      meta: {
        x: 896.4875421729283,
        y: 183.61010102080365,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message only for Spain',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'f4af1955-8621-44ed-93f1-68498499adac',
      code: 'FRANCE_ONLY_MESSAGE',
      is_code_ai_generated: true,
      meta: {
        x: 900.6570918662204,
        y: 299.75833780730477,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message only for France',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '598ca5e5-56ac-4f58-8727-27f4507375f0',
      code: 'UNITED_KINGDOM_ONLY',
      is_code_ai_generated: true,
      meta: {
        x: 899.7124975049799,
        y: 416.9350353652432,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message only for United Kingdom',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '1706adbc-31cd-4cc9-add3-901f41a956a8',
      code: 'OTHER_COUNTRIES_MESSAGE',
      is_code_ai_generated: true,
      meta: {
        x: 899.6266728962781,
        y: 548.2985258661546,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'text',
      content: {
        text: [
          {
            message: 'Message for other countries',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '5042e484-b0b8-412c-9b2a-8768828653b7',
      code: 'Go to flow',
      is_code_ai_generated: false,
      meta: {
        x: 1318.3299641099927,
        y: 263.8609033427565,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'go-to-flow',
      content: {
        flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      },
    },
    {
      id: '148f4963-8a2e-4d30-b2c1-f748155971b3',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 87.86857635527645,
        y: 412.9193307070532,
      },
      follow_up: null,
      target: {
        id: 'c16d06b0-7b05-4771-94fe-065357bd6407',
        type: 'function',
      },
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['countryConditional'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '012a6fb8-6730-4ed4-834f-c06995a21dec',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 249.67211101249413,
        y: -595.4743157872465,
      },
      follow_up: null,
      target: {
        id: 'ddaf7bf5-0677-4a59-89e0-c3859a6fb7ce',
        type: 'function',
      },
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['channelConditional'],
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
    {
      id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      name: 'Handoff',
      start_node_id: '3b363ae7-c7e5-4e6a-9df0-333cb2667637',
    },
    {
      id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      name: 'Conditionals',
      start_node_id: '7f6935df-4dab-42b9-a6f5-2f81e965cf75',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: [],
}
