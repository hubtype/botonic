/* eslint-disable @typescript-eslint/naming-convention */
export const webviewFlow = {
  version: 'draft',
  name: 'Test data',
  comments: null,
  published_by: null,
  published_on: null,
  hash: '0d00665f22d7547464ed02571205212f885ad371',
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
        x: 287.40775197469156,
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
            message: 'Welcomee',
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
              id: '0198f772-17a5-73ca-bf52-42f356eced0b',
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
      id: '0198f743-880b-773b-a61e-3e50138e4971',
      code: 'webview success',
      is_code_ai_generated: false,
      meta: {
        x: 943.75,
        y: 382.24999999999994,
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
            message: 'webview exit success',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: '0198f772-17a5-73ca-bf52-42f356eced0b',
      code: 'open webview',
      is_code_ai_generated: false,
      meta: {
        x: 580.0,
        y: 234.75,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'webview',
      content: {
        webview_target_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
        webview_name: 'Sdr webview',
        webview_component_name: 'FlowBuilderWebview',
        exits: [
          {
            id: '0198f786-6bcc-726d-880f-6aab57bcfe62',
            name: 'Success',
            target: {
              id: '0198f743-880b-773b-a61e-3e50138e4971',
              type: 'text',
            },
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
  webviews: [
    {
      id: '0198e0ee-592c-71dd-b663-579b1635cb08',
      name: 'Select a seat',
      component_name: 'SelectASeat',
    },
    {
      id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      name: 'Sdr webview',
      component_name: 'FlowBuilderWebview',
    },
    {
      id: '0198f614-fafb-71b8-9f4a-e6b057e91512',
      name: 'ExampleWebview',
      component_name: 'ExampleWebview',
    },
    {
      id: '0198f779-df6a-720c-b5eb-a280e38f1420',
      name: 'Add a baaag',
      component_name: 'AddABag',
    },
  ],
  webview_contents: [
    {
      id: '0198e11b-a234-747b-add9-b6415b48fe16',
      code: 'HEADER_TITLE',
      is_code_ai_generated: false,
      meta: {
        x: 427.5,
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
      id: '0198e1a1-5df8-727a-9b36-1f32c83dd39f',
      code: 'FOOTER',
      is_code_ai_generated: false,
      meta: {
        x: 745.8685777737932,
        y: 4.10183570641567,
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
    {
      id: '0198f778-15b7-70b5-90d1-9e2674e1a7aa',
      code: 'StartButton',
      is_code_ai_generated: false,
      meta: {
        x: 1255.7796572521142,
        y: 644.0620651398651,
      },
      webview_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Iniciar',
            locale: 'es',
          },
          {
            message: 'Iniciar',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
    {
      id: '0198f778-15b7-70b5-90d1-a13810d2540e',
      code: 'PreviousButton',
      is_code_ai_generated: false,
      meta: {
        x: 1672.7163442231004,
        y: 659.7846467419497,
      },
      webview_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Anterior',
            locale: 'es',
          },
          {
            message: 'Anterior',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
    {
      id: '0198f778-15b7-70b5-90d1-a7c2ac114370',
      code: 'NextButton',
      is_code_ai_generated: false,
      meta: {
        x: 1952.2900222244612,
        y: 651.9233559409079,
      },
      webview_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Siguiente',
            locale: 'es',
          },
          {
            message: 'Siguiente',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
    {
      id: '0198f778-15b7-70b5-90d1-a85cbb9ca36c',
      code: 'SubmitButton',
      is_code_ai_generated: false,
      meta: {
        x: 2313.9093990724064,
        y: 648.7788396204908,
      },
      webview_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Enviar',
            locale: 'es',
          },
          {
            message: 'Enviar',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
    {
      id: '0198f778-15b7-70b5-90d1-ad8a97d4ba01',
      code: 'step1',
      is_code_ai_generated: false,
      meta: {
        x: 1246.3461082908634,
        y: 304.4543025348387,
      },
      webview_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      ai_translated_locales: [],
      content: {
        image: [
          {
            id: '019680e3-9269-77bf-8835-619d326ab606',
            file: 'https://medias.dev.flowbuilder.dev.hubtype.com/assets/media_files/fdacb5ad-8b0f-4aae-aa1e-03fcd75fedaa/59ccfd1d-8f06-4518-ad04-883d0f69d43a/step1.png',
            locale: 'es',
          },
          {
            id: '0198f778-15b7-70b5-90d1-b2e6ee2c61a8',
            file: 'https://medias.dev.flowbuilder.dev.hubtype.com/assets/media_files/fdacb5ad-8b0f-4aae-aa1e-03fcd75fedaa/59ccfd1d-8f06-4518-ad04-883d0f69d43a/step1.png',
            locale: 'en',
          },
        ],
      },
      type: 'webview-image',
    },
    {
      id: '0198f778-15b7-70b5-90d1-b66a62c8f890',
      code: 'step2',
      is_code_ai_generated: false,
      meta: {
        x: 1797.8864643638235,
        y: 312.9601096562976,
      },
      webview_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      ai_translated_locales: [],
      content: {
        image: [
          {
            id: '019680e3-a73c-724b-932e-05f3ed97658f',
            file: 'https://medias.dev.flowbuilder.dev.hubtype.com/assets/media_files/fdacb5ad-8b0f-4aae-aa1e-03fcd75fedaa/59ccfd1d-8f06-4518-ad04-883d0f69d43a/step2.png',
            locale: 'es',
          },
          {
            id: '0198f778-15b7-70b5-90d1-ba1827bc3207',
            file: 'https://medias.dev.flowbuilder.dev.hubtype.com/assets/media_files/fdacb5ad-8b0f-4aae-aa1e-03fcd75fedaa/59ccfd1d-8f06-4518-ad04-883d0f69d43a/step2.png',
            locale: 'en',
          },
        ],
      },
      type: 'webview-image',
    },
    {
      id: '0198f778-15b7-70b5-90d1-bec30081c493',
      code: 'step3',
      is_code_ai_generated: false,
      meta: {
        x: 2302.9035919509474,
        y: 306.02656069504724,
      },
      webview_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      ai_translated_locales: [],
      content: {
        image: [
          {
            id: '019680e3-bc6a-7580-bb5a-dd42adc229d1',
            file: 'https://medias.dev.flowbuilder.dev.hubtype.com/assets/media_files/fdacb5ad-8b0f-4aae-aa1e-03fcd75fedaa/59ccfd1d-8f06-4518-ad04-883d0f69d43a/step3.png',
            locale: 'es',
          },
          {
            id: '0198f778-15b7-70b5-90d1-c163587f0ad2',
            file: 'https://medias.dev.flowbuilder.dev.hubtype.com/assets/media_files/fdacb5ad-8b0f-4aae-aa1e-03fcd75fedaa/59ccfd1d-8f06-4518-ad04-883d0f69d43a/step3.png',
            locale: 'en',
          },
        ],
      },
      type: 'webview-image',
    },
    {
      id: '0198f778-15b7-70b5-90d1-c6734b29e3c6',
      code: 'header',
      is_code_ai_generated: false,
      meta: {
        x: 1788.7751735627817,
        y: 56.037513221902145,
      },
      webview_id: '0198f614-fafb-71b8-9f4a-e26e9795c8e3',
      ai_translated_locales: [],
      content: {
        text: [
          {
            message: 'Reservar citas',
            locale: 'es',
          },
          {
            message: 'Reservar citas',
            locale: 'en',
          },
        ],
      },
      type: 'webview-text',
    },
    {
      id: '0198f77a-428d-723c-8ce1-9ca9e9bc55d5',
      code: 'Add a bag header',
      is_code_ai_generated: false,
      meta: {
        x: -21.323755464643366,
        y: -64.4043100409105,
      },
      webview_id: '0198f779-df6a-720c-b5eb-a280e38f1420',
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
  ],
  bot_variables: [],
}
