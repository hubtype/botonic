/* 
  To edit this flow use the flow builder bot 
  Plugin Flow Builder Tests from the backline organisation. 
*/
/* eslint-disable @typescript-eslint/naming-convention */
export const basicFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  locales: ['en'],
  start_node_id: '607205c9-6814-45ba-9aeb-2dd08d0cb529',
  ai_model_id: 'fe5465d6-f1f6-4f0d-9dd8-7a990bd62c73',
  is_knowledge_base_active: false,
  nodes: [
    {
      id: '164be5e1-9147-4d7d-938b-73e9698a3d18',
      type: 'url',
      content: {
        url: 'https://www.hubtype.com',
      },
    },
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
        x: 926.7797126865976,
        y: -111.16231337971547,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: null,
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
          {
            id: 'f1f18ae5-a480-4e49-84f1-32d13b8526e0',
            text: [
              {
                message: 'Different messages',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '0f08a723-5385-4a41-b44b-3b7b8642587d',
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
        x: 1253.1694319856201,
        y: -287.091105766608,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: null,
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
        x: 1618.8010642778809,
        y: -65.76732559753964,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
        has_initial_queue_position_enabled: false,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
        x: 1442.6222587560612,
        y: 116.52283647514702,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: null,
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
      is_meaningful: null,
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
      is_meaningful: null,
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
          {
            id: 'c7003c74-5a1e-4a63-8456-b21bf0ab16b3',
            text: [
              {
                message: 'String variable',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '70f5a184-4949-45a0-8651-d0c90dee32f1',
              type: 'function',
            },
            hidden: [],
          },
          {
            id: '3c6a2abb-9d93-4d40-a0d9-fdbd032c330e',
            text: [
              {
                message: 'Boolean variable',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '7e69d8b9-eb82-402a-a766-0a1741c3c052',
              type: 'function',
            },
            hidden: [],
          },
          {
            id: 'b88a8363-8329-4980-ad6e-e960eec2d28c',
            text: [
              {
                message: 'Number variable',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '0ad4e94f-201f-474e-8912-5b8ae1411b64',
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
        x: 549.8020633952096,
        y: -769.8083170305038,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 875.8854334232927,
        y: -825.186302414596,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 881.1520833144583,
        y: -686.6736168424795,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 885.5610148027837,
        y: -566.7235944261894,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 1508.9638818331964,
        y: -648.0836809605794,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 1880.709849967008,
        y: -779.519218363341,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 1879.480179936358,
        y: -645.3735824970338,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 1878.5355855751175,
        y: -528.1968849390954,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 1878.4497609664156,
        y: -396.833394438184,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 1430.1513314562133,
        y: 243.88333673852213,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: null,
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
        x: 1178.0311522440672,
        y: -810.1964000559951,
      },
      follow_up: null,
      target: {
        id: 'c16d06b0-7b05-4771-94fe-065357bd6407',
        type: 'function',
      },
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
        x: 276.66820963220323,
        y: -883.432701064143,
      },
      follow_up: null,
      target: {
        id: 'ddaf7bf5-0677-4a59-89e0-c3859a6fb7ce',
        type: 'function',
      },
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
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
    {
      id: '70f5a184-4949-45a0-8651-d0c90dee32f1',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 1328.1158490492994,
        y: -231.91419489651872,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'function',
      content: {
        action: 'check-bot-variable',
        arguments: [
          {
            type: 'string',
            name: 'keyPath',
            value: 'bookingType',
          },
        ],
        result_mapping: [
          {
            result: 'default',
            target: {
              id: '4321ff2a-4d2a-4553-b707-2a6a21bec19f',
              type: 'text',
            },
          },
          {
            result: 'tourist',
            target: {
              id: 'a2ebdd55-3fdc-425d-92f7-0318be442083',
              type: 'text',
            },
          },
          {
            result: 'business',
            target: {
              id: '702f9db5-5d5e-42b8-9d50-393d595f65e2',
              type: 'text',
            },
          },
          {
            result: 'first class',
            target: {
              id: '1b38e8d2-077c-4c6b-9c7a-83b4d60e9a40',
              type: 'text',
            },
          },
        ],
      },
    },
    {
      id: '7e69d8b9-eb82-402a-a766-0a1741c3c052',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 1067.3865418388361,
        y: 205.74208919990076,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'function',
      content: {
        action: 'check-bot-variable',
        arguments: [
          {
            type: 'boolean',
            name: 'keyPath',
            value: 'isLogged',
          },
        ],
        result_mapping: [
          {
            result: 'default',
            target: {
              id: 'e14fac62-d403-4c38-bfb7-2ecc60d54638',
              type: 'text',
            },
          },
          {
            result: true,
            target: {
              id: '4ce65a26-30c2-4236-9078-9995d856615b',
              type: 'text',
            },
          },
          {
            result: false,
            target: {
              id: 'e14fac62-d403-4c38-bfb7-2ecc60d54638',
              type: 'text',
            },
          },
        ],
      },
    },
    {
      id: '01abe8b5-369d-4ebe-8f2d-cf17c727d546',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 1053.8126132003886,
        y: -229.3309738239643,
      },
      follow_up: null,
      target: {
        id: '70f5a184-4949-45a0-8651-d0c90dee32f1',
        type: 'function',
      },
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['stringVariable'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '53fa5e7e-a0cc-4a0e-bea9-d577d89abd41',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 763.4228498537524,
        y: 104.42085853820615,
      },
      follow_up: null,
      target: {
        id: '7e69d8b9-eb82-402a-a766-0a1741c3c052',
        type: 'function',
      },
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['booleanVariable'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '79aa9e20-d1bc-4546-be73-24bd8aac63cf',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 191.5929549358214,
        y: 569.0001276620213,
      },
      follow_up: null,
      target: {
        id: '0ad4e94f-201f-474e-8912-5b8ae1411b64',
        type: 'function',
      },
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['numberVariable'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '702f9db5-5d5e-42b8-9d50-393d595f65e2',
      code: 'BUSINESS_BOOKING',
      is_code_ai_generated: true,
      meta: {
        x: 1662.0015648912574,
        y: -120.8554121307929,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'The booking is business',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '4ce65a26-30c2-4236-9078-9995d856615b',
      code: 'USER_LOGGED_IN',
      is_code_ai_generated: true,
      meta: {
        x: 1364.4044255030542,
        y: 262.516994150313,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'User is logged in',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'e14fac62-d403-4c38-bfb7-2ecc60d54638',
      code: 'LOGGED_OUT',
      is_code_ai_generated: true,
      meta: {
        x: 1366.6508353614554,
        y: 415.45251067775905,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'User is logged out',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '981be6fb-f2f8-4dfd-b997-6b1b0d0ab080',
      code: 'NO_SUITCASES_IN_BOOKING',
      is_code_ai_generated: true,
      meta: {
        x: 993.0725072726414,
        y: 483.63434844658013,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'The user has no bags in the booking',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '3dd74922-70d4-4e2a-950c-1496511cd846',
      code: 'BAGS_IN_BOOKING',
      is_code_ai_generated: true,
      meta: {
        x: 988.0803340868363,
        y: 612.3470192208484,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'The user has 1 bag in the booking',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '74feb945-f8ce-4868-afbf-78cdb7228c89',
      code: 'TWO_BAGS_BOOKING',
      is_code_ai_generated: true,
      meta: {
        x: 985.7718997956254,
        y: 739.3109052374475,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'The user has 2 bags in the booking',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '5715facc-b8d4-4814-9986-287b656b682a',
      code: 'MORE_THAN_TWO_LUGGAGE',
      is_code_ai_generated: true,
      meta: {
        x: 983.4634655044144,
        y: 872.0458769820738,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message:
              'This is the message that is displayed if the value is not defined or is none of the others',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'a2ebdd55-3fdc-425d-92f7-0318be442083',
      code: 'TOURIST_BOOKING',
      is_code_ai_generated: true,
      meta: {
        x: 1661.3659822209759,
        y: -249.88836514357422,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'The booking is tourist',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '1b38e8d2-077c-4c6b-9c7a-83b4d60e9a40',
      code: 'FIRST_CLASS_BOOKING',
      is_code_ai_generated: true,
      meta: {
        x: 1662.270189054374,
        y: -2.1356927925535985,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'The booking is first class',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '4321ff2a-4d2a-4553-b707-2a6a21bec19f',
      code: 'BOOKING_TYPE',
      is_code_ai_generated: true,
      meta: {
        x: 1663.1743958877717,
        y: 123.54905704975249,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'The booking is {bookingType}',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '99badeca-29e1-4855-866c-3cf9b60bb6a8',
      code: 'ALL_TYPES_MESSAGES',
      is_code_ai_generated: true,
      meta: {
        x: 228.16535174874664,
        y: -144.01122140727102,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'All types of messages',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: 'fb221de1-fcb0-4468-86c0-322c21ee161f',
            text: [
              {
                message: 'Text',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '7afe0981-e9d3-4e3e-b9d1-5d362d3873b3',
              type: 'text',
            },
            hidden: [],
          },
          {
            id: '35133a3a-914d-46d1-a14a-e9fc7d78d228',
            text: [
              {
                message: 'Carousel',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'd6f17ff2-a8de-4b57-8062-497616a6d35a',
              type: 'carousel',
            },
            hidden: [],
          },
          {
            id: '983021d7-0335-491c-9767-436302b09874',
            text: [
              {
                message: 'Image',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '4140f25f-ab22-4c18-b13a-1fdb265368b6',
              type: 'image',
            },
            hidden: [],
          },
          {
            id: '7fcaa28d-5a4b-4ba4-9b43-1495019219d5',
            text: [
              {
                message: 'Video',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'a1f94824-b620-4f58-9e7a-67e596efbd9d',
              type: 'video',
            },
            hidden: [],
          },
          {
            id: '41a5a26d-6599-4eca-8a2f-296dea5ebc4b',
            text: [
              {
                message: 'Button list',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '07a91a2f-cc4e-480a-9f81-7767588682e2',
              type: 'whatsapp-button-list',
            },
            hidden: [],
          },
          {
            id: '29854722-d1c0-4471-aa76-824ca9122974',
            text: [
              {
                message: 'URL Button',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'febabaa2-e6fe-4777-873b-2a874efcf248',
              type: 'whatsapp-cta-url-button',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: '0f08a723-5385-4a41-b44b-3b7b8642587d',
      code: 'Go to flow',
      is_code_ai_generated: false,
      meta: {
        x: 1231.7324917501842,
        y: 379.512322247361,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: null,
      type: 'go-to-flow',
      content: {
        flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      },
    },
    {
      id: '7afe0981-e9d3-4e3e-b9d1-5d362d3873b3',
      code: 'BUTTONS_REPLACEMENT_VARIABLE',
      is_code_ai_generated: true,
      meta: {
        x: 697.5159871989872,
        y: -878.2914390450592,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message:
              'This text message contains buttons and replaces the variable {bagsAdded}',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: 'a77a9ba3-6a70-465f-bf50-366a43740101',
            text: [
              {
                message: 'Button to text',
                locale: 'en',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'eb877738-3cf4-4a57-9f46-3122e18f1cc7',
              type: 'text',
            },
            hidden: [],
          },
          {
            id: '18f161be-4e6f-4fce-a44b-19d9ad423e72',
            text: [
              {
                message: 'Button to url',
                locale: 'en',
              },
            ],
            url: [
              {
                id: '164be5e1-9147-4d7d-938b-73e9698a3d18',
                locale: 'en',
              },
            ],
            payload: [],
            target: null,
            hidden: [],
          },
        ],
      },
    },
    {
      id: 'd6f17ff2-a8de-4b57-8062-497616a6d35a',
      code: 'CAROUSEL_65',
      is_code_ai_generated: true,
      meta: {
        x: 955.1637874563928,
        y: -510.8440989771652,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'carousel',
      content: {
        elements: [
          {
            id: 'fe84e80f-5b9c-4902-9285-17ca950325be',
            title: [
              {
                message: 'Title element 1',
                locale: 'en',
              },
            ],
            subtitle: [
              {
                message: 'Subtitle element 1',
                locale: 'en',
              },
            ],
            image: [
              {
                id: '6e62767f-c05d-4f05-afe0-ac7f6feeed5a',
                file: 'https://medias.ent0.flowbuilder.prod.hubtype.com/assets/media_files/825f22e5-421e-4d8d-bdd9-2fb9c6f6e4cb/9415a943-286f-4b69-a983-f4a4ca59b6dc/bola4estrellas.png',
                locale: 'en',
              },
            ],
            button: {
              id: 'fc7560d0-67fe-4554-9fb0-1f6bdcd6beb9',
              text: [
                {
                  message: 'Button to url',
                  locale: 'en',
                },
              ],
              url: [
                {
                  id: '164be5e1-9147-4d7d-938b-73e9698a3d18',
                  locale: 'en',
                },
              ],
              payload: [],
              target: null,
              hidden: [],
            },
          },
          {
            id: 'c2e5f1c8-9d06-47db-98e9-ada3dc7d32ac',
            title: [
              {
                message: 'Title element 2',
                locale: 'en',
              },
            ],
            subtitle: [
              {
                message: 'Subtitle element 2',
                locale: 'en',
              },
            ],
            image: [
              {
                id: 'c97ef24c-6b44-497e-aad6-05d3c47b5ce8',
                file: 'https://medias.ent0.flowbuilder.prod.hubtype.com/assets/media_files/825f22e5-421e-4d8d-bdd9-2fb9c6f6e4cb/9415a943-286f-4b69-a983-f4a4ca59b6dc/Vermut.jpeg',
                locale: 'en',
              },
            ],
            button: {
              id: 'f953b978-d6db-461b-9c46-3ac029613122',
              text: [
                {
                  message: 'Button text 2',
                  locale: 'en',
                },
              ],
              url: [],
              payload: [],
              target: {
                id: 'bff4c6de-06b2-411a-9d13-0fd3c08ce34f',
                type: 'text',
              },
              hidden: [],
            },
          },
        ],
      },
    },
    {
      id: 'eb877738-3cf4-4a57-9f46-3122e18f1cc7',
      code: 'MESSAGE_AFTER_BUTTON_TEXT_1',
      is_code_ai_generated: true,
      meta: {
        x: 1022.5498687348133,
        y: -851.3575781477193,
      },
      follow_up: {
        id: 'be6eb44d-ab5c-46e4-b51f-ad0665946b21',
        type: 'text',
      },
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'Message after button text 1',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'bff4c6de-06b2-411a-9d13-0fd3c08ce34f',
      code: 'BUTTON_2_MESSAGE',
      is_code_ai_generated: true,
      meta: {
        x: 1308.9522027695225,
        y: -543.7234810769891,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'Message after button 2 of carousel',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '4140f25f-ab22-4c18-b13a-1fdb265368b6',
      code: 'IMAGE_16',
      is_code_ai_generated: true,
      meta: {
        x: 1177.51996320645,
        y: -302.9225687176279,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'image',
      content: {
        image: [
          {
            id: '69259c53-cf90-4a2b-b436-56c0ade0fcfb',
            file: 'https://medias.ent0.flowbuilder.prod.hubtype.com/assets/media_files/825f22e5-421e-4d8d-bdd9-2fb9c6f6e4cb/9415a943-286f-4b69-a983-f4a4ca59b6dc/link-2.png',
            locale: 'en',
          },
        ],
      },
    },
    {
      id: 'be6eb44d-ab5c-46e4-b51f-ad0665946b21',
      code: 'FOLLOWUP_BUTTON_TEXT_1',
      is_code_ai_generated: true,
      meta: {
        x: 1333.7125819201087,
        y: -932.0207792813799,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'Followup of message after button text 1',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'a1f94824-b620-4f58-9e7a-67e596efbd9d',
      code: 'VIDEO_74',
      is_code_ai_generated: true,
      meta: {
        x: 1189.9960330222464,
        y: 87.1353488513532,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'video',
      content: {
        video: [
          {
            url: 'https://www.youtube.com/watch?v=M11dw4o3Au4',
            is_embedded: false,
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '07a91a2f-cc4e-480a-9f81-7767588682e2',
      code: 'WHATSAPP_BUTTON_LIST',
      is_code_ai_generated: true,
      meta: {
        x: 1479.9556416942435,
        y: 213.13222989329068,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'whatsapp-button-list',
      content: {
        text: [
          {
            message: 'WhatsApp button list',
            locale: 'en',
          },
        ],
        button_text: [
          {
            message: 'Menu',
            locale: 'en',
          },
        ],
        sections: [
          {
            id: '2638db97-3f21-4370-a32b-ebe46de87a34',
            title: [
              {
                message: 'Section 1',
                locale: 'en',
              },
            ],
            rows: [
              {
                id: '713cf03a-054a-4d63-b9df-c3c352c8a072',
                text: [
                  {
                    message: 'Row title 1',
                    locale: 'en',
                  },
                ],
                description: [
                  {
                    message: 'Row description 1',
                    locale: 'en',
                  },
                ],
                target: {
                  id: '128970b5-3404-472c-a0e7-b6aaa8d38bc9',
                  type: 'text',
                },
              },
              {
                id: 'c1aaee8f-9309-4534-ac04-f1a4fcb2ce3b',
                text: [
                  {
                    message: 'Row title 2',
                    locale: 'en',
                  },
                ],
                description: [
                  {
                    message: 'Row description 2',
                    locale: 'en',
                  },
                ],
                target: {
                  id: 'ac42c9fa-bbf0-4b07-bd15-44da02077247',
                  type: 'text',
                },
              },
              {
                id: '723a087d-f7d6-42bc-8347-845560ac669d',
                text: [
                  {
                    message: 'Row title 3',
                    locale: 'en',
                  },
                ],
                description: [
                  {
                    message: '',
                    locale: 'en',
                  },
                ],
                target: {
                  id: '0cf262e2-685d-494e-bc8c-66cea15e3eff',
                  type: 'text',
                },
              },
              {
                id: 'a7f1b016-e4a9-4867-9c59-d67af500fe64',
                text: [
                  {
                    message: 'Row title 4',
                    locale: 'en',
                  },
                ],
                description: [
                  {
                    message: '',
                    locale: 'en',
                  },
                ],
                target: {
                  id: '2dd4eb5d-73c5-4996-8ffa-956cd4b73243',
                  type: 'text',
                },
              },
            ],
          },
        ],
      },
    },
    {
      id: 'febabaa2-e6fe-4777-873b-2a874efcf248',
      code: 'WHATSAPP_URL_CTA_BUTTON',
      is_code_ai_generated: true,
      meta: {
        x: 662.8619410959665,
        y: 287.18539539205585,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'whatsapp-cta-url-button',
      content: {
        text: [
          {
            message: 'WhatsApp URL CTA button',
            locale: 'en',
          },
        ],
        header: [
          {
            message: 'Header text',
            locale: 'en',
          },
        ],
        footer: [
          {
            message: 'footer text',
            locale: 'en',
          },
        ],
        button: {
          id: 'e89879ca-18c6-4381-a188-e3b37197d492',
          text: [
            {
              message: 'Button text',
              locale: 'en',
            },
          ],
          url: [
            {
              id: '164be5e1-9147-4d7d-938b-73e9698a3d18',
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
      id: '128970b5-3404-472c-a0e7-b6aaa8d38bc9',
      code: 'AFTER_ROW_ONE',
      is_code_ai_generated: true,
      meta: {
        x: 1888.7698937199696,
        y: 88.59302482387866,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'Text after row 1',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'ac42c9fa-bbf0-4b07-bd15-44da02077247',
      code: 'AFTER_ROW_TWO',
      is_code_ai_generated: true,
      meta: {
        x: 1890.8535198163518,
        y: 202.46198304551825,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'Text after row 2',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '0cf262e2-685d-494e-bc8c-66cea15e3eff',
      code: 'AFTER_ROW_3',
      is_code_ai_generated: true,
      meta: {
        x: 1890.4640516920667,
        y: 318.34396363179263,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'Text after row 3',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '2dd4eb5d-73c5-4996-8ffa-956cd4b73243',
      code: 'AFTER_ROW_4',
      is_code_ai_generated: false,
      meta: {
        x: 1889.6489479829931,
        y: 439.9166326367276,
      },
      follow_up: null,
      target: null,
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'text',
      content: {
        text: [
          {
            message: 'Text after row 4',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '0462053d-0b9b-4f36-a19b-0e25e687af2d',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: -121.63226267146524,
        y: -187.38518693356136,
      },
      follow_up: null,
      target: {
        id: '99badeca-29e1-4855-866c-3cf9b60bb6a8',
        type: 'text',
      },
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['differentMessages'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '8ec6a479-dca5-4623-8bab-41fa49c9d6e8',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 227.66304778904035,
        y: -918.3254123731216,
      },
      follow_up: null,
      target: {
        id: '7afe0981-e9d3-4e3e-b9d1-5d362d3873b3',
        type: 'text',
      },
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['flowText'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: 'd5f69849-d6c9-4845-9ed0-1ac999098ad3',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 688.39997409608,
        y: -586.5527995084371,
      },
      follow_up: null,
      target: {
        id: 'd6f17ff2-a8de-4b57-8062-497616a6d35a',
        type: 'carousel',
      },
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['flowCarousel'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '83ad6b2b-2240-4d2e-8be3-8543b76791c7',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 786.6092862088249,
        y: -302.2270803512114,
      },
      follow_up: null,
      target: {
        id: '4140f25f-ab22-4c18-b13a-1fdb265368b6',
        type: 'image',
      },
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['flowImage'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '059064c7-f37c-407a-8e92-ab8dbd073f7e',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 839.7855385035422,
        y: -1.9261167769942915,
      },
      follow_up: null,
      target: {
        id: 'a1f94824-b620-4f58-9e7a-67e596efbd9d',
        type: 'video',
      },
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['flowVideo'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '72d02d8e-e88d-4bcb-a11d-8dd0952e665a',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 1121.3759810414992,
        y: 497.6076134786967,
      },
      follow_up: null,
      target: {
        id: '07a91a2f-cc4e-480a-9f81-7767588682e2',
        type: 'whatsapp-button-list',
      },
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['flowButtonList'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '2055cd95-b48b-48cb-825b-7787ec4462fd',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 284.31946007250366,
        y: 420.4595470299414,
      },
      follow_up: null,
      target: {
        id: 'febabaa2-e6fe-4777-873b-2a874efcf248',
        type: 'whatsapp-cta-url-button',
      },
      flow_id: '43a736f8-4837-4fbb-a661-021291749b4f',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['flowURLButton'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '0ad4e94f-201f-474e-8912-5b8ae1411b64',
      code: 'Custom Conditional Number',
      is_code_ai_generated: false,
      meta: {
        x: 614.7060799789346,
        y: 526.5926529619337,
      },
      follow_up: null,
      target: null,
      flow_id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      is_meaningful: null,
      type: 'function',
      content: {
        action: 'check-bot-variable',
        arguments: [
          {
            type: 'number',
            name: 'keyPath',
            value: 'bagsAdded',
          },
        ],
        result_mapping: [
          {
            result: 'default',
            target: {
              id: '5715facc-b8d4-4814-9986-287b656b682a',
              type: 'text',
            },
          },
          {
            result: 0,
            target: {
              id: '981be6fb-f2f8-4dfd-b997-6b1b0d0ab080',
              type: 'text',
            },
          },
          {
            result: 1,
            target: {
              id: '3dd74922-70d4-4e2a-950c-1496511cd846',
              type: 'text',
            },
          },
          {
            result: 2,
            target: {
              id: '74feb945-f8ce-4868-afbf-78cdb7228c89',
              type: 'text',
            },
          },
        ],
      },
    },
    {
      id: 'e72899cc-91ad-4987-ad1c-3a9991c8811f',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 437.12449600376215,
        y: -225.5132070881366,
      },
      follow_up: null,
      target: {
        id: '07947391-3460-45fb-a195-2c2e12483ad3',
        type: 'handoff',
      },
      flow_id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      is_meaningful: null,
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          {
            values: ['handoff'],
            locale: 'en',
          },
        ],
      },
    },
    {
      id: '1ce92e20-3286-4077-80e0-b1d890b66487',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 1271.816475698173,
        y: -137.1586714352393,
      },
      follow_up: null,
      target: {
        id: '59071c29-2cd7-447a-b290-04269b76701d',
        type: 'text',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: null,
      type: 'intent',
      content: {
        title: [],
        intents: [
          {
            values: ['select a seat'],
            locale: 'en',
          },
        ],
        confidence: 50,
      },
    },
    {
      id: 'a962b2e5-9424-4fe5-81bd-8cb398b59875',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 924.8309575588046,
        y: -433.9169466024687,
      },
      follow_up: null,
      target: {
        id: 'a91c0bca-c213-4693-b3bd-f091fcbf445c',
        type: 'text',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: null,
      type: 'smart-intent',
      content: {
        title: 'add a bag',
        description: 'the user wants to add a bag to his booking',
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
      id: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
      name: 'Conditionals',
      start_node_id: '7f6935df-4dab-42b9-a6f5-2f81e965cf75',
    },
    {
      id: '43a736f8-4837-4fbb-a661-021291749b4f',
      name: 'Different messages',
      start_node_id: '99badeca-29e1-4855-866c-3cf9b60bb6a8',
    },
    {
      id: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
      name: 'Handoff',
      start_node_id: '3b363ae7-c7e5-4e6a-9df0-333cb2667637',
    },
    {
      id: 'e589fd0d-7323-4cc2-81f7-4902b1addbcf',
      name: 'Rating',
      start_node_id: '578b30eb-d230-4162-8a36-6c7fa18ff0db',
    },
    {
      id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      name: 'Fallback',
      start_node_id: 'f3931bce-7de3-5c7a-8287-81f0292ee4f3',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: ['bagsAdded', 'bookingType', 'isLogged'],
}
