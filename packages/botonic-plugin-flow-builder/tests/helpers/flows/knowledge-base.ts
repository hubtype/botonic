/* eslint-disable @typescript-eslint/naming-convention */
export const knowledgeBaseTestFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  locales: ['es'],
  start_node_id: 'b0476c56-9cd8-4e0d-bbff-67653d3b22b4',
  ai_model_id: null,
  is_knowledge_base_active: true,
  nodes: [
    {
      id: '796d71e6-d72f-4a87-af2e-80bb843dc574',
      type: 'url',
      content: {
        url: 'https://app.hubtype.com/bots/9415a943-286f-4b69-a983-f4a4ca59b6dc/integrations/add',
      },
    },
    {
      id: '8bdced1c-9e93-4250-8c16-e22b7af369fe',
      type: 'url',
      content: {
        url: 'https://github.com/metis-ai/flow-builder/pull/391',
      },
    },
    {
      id: '8d92d83d-2237-45ec-99d3-ca0ecc09db26',
      type: 'url',
      content: {
        url: 'https://hubtype.atlassian.net/jira/software/c/projects/BLT/boards/22?assignee=5e4aa263e7724a0e7262f99f&selectedIssue=BLT-706',
      },
    },
    {
      id: 'f179eabe-549a-474a-ba32-62388ca6c6bf',
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
          id: 'd45447c5-5e39-4ebc-8321-f2654fefd5ea',
          type: 'text',
        },
        second_message: {
          id: '7ed30608-44d8-4559-94c6-8bee614aec5d',
          type: 'text',
        },
        is_knowledge_base_active: true,
        knowledge_base_followup: null,
      },
    },
    {
      id: 'b0476c56-9cd8-4e0d-bbff-67653d3b22b4',
      code: 'WELCOME_MSG',
      is_code_ai_generated: false,
      meta: {
        x: 356.79565582142897,
        y: -74.91336001699318,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'Welcome',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: 'f7f26704-4dae-4496-801e-83378242c203',
            text: [
              {
                message: 'handoff',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '919d8407-b3d0-4186-ad12-af28d31c3b4b',
              type: 'function',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: 'd45447c5-5e39-4ebc-8321-f2654fefd5ea',
      code: 'FALLBACK_MSG_1',
      is_code_ai_generated: false,
      meta: {
        x: 661.25,
        y: 37.250000000000014,
      },
      follow_up: null,
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      type: 'text',
      content: {
        text: [
          {
            message: 'fallback 1',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '5d335494-7c6d-4e80-b5d6-2aef5c528c44',
      code: 'SOON_ATTENDED_AGENT',
      is_code_ai_generated: true,
      meta: {
        x: 1144.0044791085597,
        y: -6.079940402323928,
      },
      follow_up: {
        id: 'e09f4616-30bf-488c-913d-77d19c687e83',
        type: 'handoff',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'You will soon be attended by an agent',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '919d8407-b3d0-4186-ad12-af28d31c3b4b',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 736.4135313337908,
        y: -82.75546523124083,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'function',
      content: {
        action: 'check-queue-status',
        arguments: [
          {
            locale: 'es',
            values: [
              {
                type: 'string',
                name: 'queue_id',
                value: 'a862e436-4b38-4673-bd68-208658614e14',
              },
              {
                type: 'string',
                name: 'queue_name',
                value: 'Generic',
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
              id: '5d335494-7c6d-4e80-b5d6-2aef5c528c44',
              type: 'text',
            },
          },
          {
            result: 'closed',
            target: {
              id: 'ad6d9b7b-6b69-4fcf-86cd-be3b97f79266',
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
      id: 'ad6d9b7b-6b69-4fcf-86cd-be3b97f79266',
      code: 'CLOSED_FOR_HOURS',
      is_code_ai_generated: true,
      meta: {
        x: 1137.9511482010137,
        y: 157.35999410142006,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'We are currently closed for business hours',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'e09f4616-30bf-488c-913d-77d19c687e83',
      code: 'HANDOFF_81',
      is_code_ai_generated: true,
      meta: {
        x: 1501.1510026537778,
        y: -22.22215615578014,
      },
      follow_up: null,
      target: {
        id: '787b9aba-5935-46e4-a359-0d0b965893a9',
        type: 'text',
      },
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'handoff',
      content: {
        queue: [
          {
            id: 'a862e436-4b38-4673-bd68-208658614e14',
            name: 'Generic',
            locale: 'es',
          },
        ],
        payload: [],
        has_auto_assign: false,
        has_initial_queue_position_enabled: false,
      },
    },
    {
      id: '787b9aba-5935-46e4-a359-0d0b965893a9',
      code: 'ATTENTION_RECEIVED_RATE',
      is_code_ai_generated: true,
      meta: {
        x: 1924.884166182003,
        y: -121.09322764569932,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'How would you rate the attention received?',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: 'f4f81b43-9b2e-43ff-929f-c906770e963a',
            text: [
              {
                message: '\u2b50\u2b50\u2b50\u2b50\u2b50',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '01f0079e-cf66-4ea4-9c9e-c750ea9db2ea',
              type: 'bot-action',
            },
            hidden: [],
          },
          {
            id: 'd41caa37-1b53-4015-a30e-be7b3b25ab89',
            text: [
              {
                message: '\u2b50\u2b50\u2b50\u2b50',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '9392e3f9-fae5-4dd1-a2e3-c8821e20a327',
              type: 'bot-action',
            },
            hidden: [],
          },
          {
            id: 'f812d13f-88f4-431d-9da5-4af5a7ae3c7a',
            text: [
              {
                message: '\u2b50\u2b50\u2b50',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'b298ecae-9e8d-481c-815c-0c3db65291fd',
              type: 'bot-action',
            },
            hidden: [],
          },
          {
            id: '6ba9a721-51ab-4a47-be84-2093126bc1bc',
            text: [
              {
                message: '\u2b50\u2b50',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '5b40814b-43af-490d-9593-f67e8d34f1b3',
              type: 'bot-action',
            },
            hidden: [],
          },
          {
            id: '1a92dc3c-1d56-4e51-8f69-3ae0152dab2a',
            text: [
              {
                message: '\u2b50',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: '39aef1de-9ee2-43b1-9a1d-c67a21081b4d',
              type: 'bot-action',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: '01f0079e-cf66-4ea4-9c9e-c750ea9db2ea',
      code: 'BOT-ACTION_40',
      is_code_ai_generated: true,
      meta: {
        x: 2326.421783049226,
        y: -207.85763732052635,
      },
      follow_up: {
        id: '7f75e4ee-12f9-4fc5-ad6f-9efee9d48d2a',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'bot-action',
      content: {
        payload_id: 'f179eabe-549a-474a-ba32-62388ca6c6bf',
        payload_params: '{"value":5}',
      },
    },
    {
      id: '9392e3f9-fae5-4dd1-a2e3-c8821e20a327',
      code: 'BOT-ACTION_24',
      is_code_ai_generated: true,
      meta: {
        x: 2360.27956729577,
        y: -58.98656583060716,
      },
      follow_up: {
        id: '7f75e4ee-12f9-4fc5-ad6f-9efee9d48d2a',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'bot-action',
      content: {
        payload_id: 'f179eabe-549a-474a-ba32-62388ca6c6bf',
        payload_params: '{"value":5}',
      },
    },
    {
      id: 'b298ecae-9e8d-481c-815c-0c3db65291fd',
      code: 'BOT-ACTION_98',
      is_code_ai_generated: true,
      meta: {
        x: 2354.226236388224,
        y: 90.3289298888626,
      },
      follow_up: {
        id: 'ede75094-2b92-496c-bb0f-6a6b0ad01809',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'bot-action',
      content: {
        payload_id: 'f179eabe-549a-474a-ba32-62388ca6c6bf',
        payload_params: '{"value":5}',
      },
    },
    {
      id: '5b40814b-43af-490d-9593-f67e8d34f1b3',
      code: 'BOT-ACTION_92',
      is_code_ai_generated: true,
      meta: {
        x: 2364.315121234134,
        y: 239.64442560833243,
      },
      follow_up: {
        id: 'ede75094-2b92-496c-bb0f-6a6b0ad01809',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'bot-action',
      content: {
        payload_id: 'f179eabe-549a-474a-ba32-62388ca6c6bf',
        payload_params: '{"value":5}',
      },
    },
    {
      id: '39aef1de-9ee2-43b1-9a1d-c67a21081b4d',
      code: 'BOT-ACTION_6',
      is_code_ai_generated: true,
      meta: {
        x: 2358.261790326588,
        y: 407.11991405044046,
      },
      follow_up: {
        id: 'ede75094-2b92-496c-bb0f-6a6b0ad01809',
        type: 'text',
      },
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'bot-action',
      content: {
        payload_id: 'f179eabe-549a-474a-ba32-62388ca6c6bf',
        payload_params: '{"value":5}',
      },
    },
    {
      id: '7f75e4ee-12f9-4fc5-ad6f-9efee9d48d2a',
      code: 'THANK_YOU_MUCH',
      is_code_ai_generated: true,
      meta: {
        x: 2772.350493238453,
        y: -119.07545067651729,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'thank you very much',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'ede75094-2b92-496c-bb0f-6a6b0ad01809',
      code: 'FEEDBACK_IMPROVEMENT_IDENTIFIER',
      is_code_ai_generated: true,
      meta: {
        x: 2939.825981680561,
        y: 225.96441105360887,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'thank you we will use the feedback to improve',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '7ed30608-44d8-4559-94c6-8bee614aec5d',
      code: 'FALLBACK_MSG_2',
      is_code_ai_generated: false,
      meta: {
        x: 572.1311902706037,
        y: 174.73605826330834,
      },
      follow_up: {
        id: '7e87c710-4132-4a42-bad7-aef1bf56615f',
        type: 'go-to-flow',
      },
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      type: 'text',
      content: {
        text: [
          {
            message: 'fallback 2',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '7e87c710-4132-4a42-bad7-aef1bf56615f',
      code: 'Go to flow',
      is_code_ai_generated: false,
      meta: {
        x: 858.9440878257466,
        y: 177.7030882380167,
      },
      follow_up: null,
      target: null,
      flow_id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      type: 'go-to-flow',
      content: {
        flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      },
    },
    {
      id: '2565d5e6-7aee-4921-a21d-31786d4c0190',
      code: 'TEST_INTENT_MSG',
      is_code_ai_generated: false,
      meta: {
        x: 962.9769085020173,
        y: 423.8655693552008,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      type: 'text',
      content: {
        text: [
          {
            message: 'add a abg case after intent',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '1f37ccab-bccd-4d88-8e86-e231e1834944',
      code: 'MESSAGE_BEFORE_KNOWLEDGE_RESPONSE',
      is_code_ai_generated: true,
      meta: {
        x: 545.5660413126438,
        y: -154.50855706365218,
      },
      follow_up: {
        id: 'b2ac9457-6928-41ea-9474-911133a75ff4',
        type: 'knowledge-base',
      },
      target: null,
      flow_id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      type: 'text',
      content: {
        text: [
          {
            message: 'message Spain before knowledge response',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'b2ac9457-6928-41ea-9474-911133a75ff4',
      code: 'Knowledge node 1',
      is_code_ai_generated: false,
      meta: {
        x: 1266.5766571850525,
        y: -98.09051840571587,
      },
      follow_up: {
        id: '1582b8e3-0b9f-4c79-b0db-98f351522cc3',
        type: 'text',
      },
      target: null,
      flow_id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      type: 'knowledge-base',
      content: {
        sources_data: [
          { id: 'sourceId1', name: 'Flow Builder - No images.pdf' },
        ],
      },
    },
    {
      id: '994ffb8c-2334-4fc3-9e38-eea3b6edc43d',
      code: '',
      is_code_ai_generated: false,
      meta: {
        x: 171.82245456509133,
        y: -41.48088229946717,
      },
      follow_up: null,
      target: null,
      flow_id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      type: 'function',
      content: {
        action: 'check-country',
        arguments: [],
        result_mapping: [
          {
            result: 'default',
            target: {
              id: 'c773d758-4750-4334-a2f0-e07b8d670681',
              type: 'text',
            },
          },
          {
            result: 'ES',
            target: {
              id: '1f37ccab-bccd-4d88-8e86-e231e1834944',
              type: 'text',
            },
          },
          {
            result: 'PT',
            target: {
              id: '6ef0e4f9-a784-41e5-a6bc-634b558570f8',
              type: 'text',
            },
          },
        ],
      },
    },
    {
      id: '6ef0e4f9-a784-41e5-a6bc-634b558570f8',
      code: 'PORTUGAL_BEFORE_KNOWLEDGE',
      is_code_ai_generated: true,
      meta: {
        x: 550.7553458921369,
        y: 11.252406105990815,
      },
      follow_up: {
        id: 'b2ac9457-6928-41ea-9474-911133a75ff4',
        type: 'knowledge-base',
      },
      target: null,
      flow_id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      type: 'text',
      content: {
        text: [
          {
            message: 'message Portugal before knowledge response',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'c773d758-4750-4334-a2f0-e07b8d670681',
      code: 'OTHER_COUNTRY_BEFORE_MAIN',
      is_code_ai_generated: true,
      meta: {
        x: 562.0209281269724,
        y: 201.28582929507496,
      },
      follow_up: null,
      target: null,
      flow_id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      type: 'text',
      content: {
        text: [
          {
            message: 'message Other country',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [
          {
            id: 'ab3d34aa-5549-4d72-ad5f-9b7aeb22dc48',
            text: [
              {
                message: 'knowledge base',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'ca299298-8571-46ca-b516-03ed03c09a43',
              type: 'text',
            },
            hidden: [],
          },
          {
            id: 'c40f8f8c-57dd-4bab-915a-262e13952456',
            text: [
              {
                message: 'main',
                locale: 'es',
              },
            ],
            url: [],
            payload: [],
            target: {
              id: 'be6e00bf-0447-4033-a58f-08c4b035a7d4',
              type: 'go-to-flow',
            },
            hidden: [],
          },
        ],
      },
    },
    {
      id: 'be6e00bf-0447-4033-a58f-08c4b035a7d4',
      code: 'Go to flow',
      is_code_ai_generated: false,
      meta: {
        x: 929.9932203074035,
        y: 306.2523093973096,
      },
      follow_up: null,
      target: null,
      flow_id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      type: 'go-to-flow',
      content: {
        flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      },
    },
    {
      id: '1582b8e3-0b9f-4c79-b0db-98f351522cc3',
      code: 'FOLLOWUP_KNOWLEDGE_BASE',
      is_code_ai_generated: true,
      meta: {
        x: 1571.1668867588255,
        y: -89.96059441128254,
      },
      follow_up: null,
      target: null,
      flow_id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      type: 'text',
      content: {
        text: [
          {
            message: 'FollowUp Knowledge base',
            locale: 'es',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'ca299298-8571-46ca-b516-03ed03c09a43',
      code: 'LALALA_IDENTIFIER',
      is_code_ai_generated: true,
      meta: {
        x: 970.4742523112586,
        y: 173.4213664253258,
      },
      follow_up: {
        id: 'b2ac9457-6928-41ea-9474-911133a75ff4',
        type: 'knowledge-base',
      },
      target: null,
      flow_id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      type: 'text',
      content: {
        text: [
          {
            message: 'lalalala',
            locale: 'es',
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
      start_node_id: 'b0476c56-9cd8-4e0d-bbff-67653d3b22b4',
    },
    {
      id: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
      name: 'Knowledge base',
      start_node_id: '994ffb8c-2334-4fc3-9e38-eea3b6edc43d',
    },
    {
      id: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
      name: 'Fallback',
      start_node_id: 'f3931bce-7de3-5c7a-8287-81f0292ee4f3',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: ['number'],
}
