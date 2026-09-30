/* eslint-disable @typescript-eslint/naming-convention */
const WhatsAppTemplateComponentType = {
  BODY: 'BODY',
} as const

/** Main welcome + push-flow campaign that starts on a WhatsApp template node. */
export const campaignsWhatsappTemplatePushFlow = {
  version: 'draft',
  name: 'Campaigns WhatsApp Template Push Flow',
  comments: null,
  published_by: null,
  published_on: null,
  hash: 'campaigns-wa-template-push-flow-hash',
  default_locale_code: 'en',
  locales: ['en'],
  translated_locales: [],
  start_node_id: 'main-start-node',
  ai_model_id: null,
  is_knowledge_base_active: false,
  nodes: [
    {
      id: 'main-start-node',
      code: 'MAIN_START',
      is_code_ai_generated: false,
      meta: { x: 0, y: 0 },
      follow_up: null,
      target: null,
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [{ message: 'Welcome to main flow', locale: 'en' }],
        buttons_style: 'button',
        buttons: [],
      },
    },
    {
      id: 'campaign-template-start-node',
      code: 'CAMPAIGN_TEMPLATE_START',
      is_code_ai_generated: false,
      meta: { x: 300, y: 0 },
      follow_up: null,
      target: null,
      flow_id: 'campaign-template-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-template',
      content: {
        by_locale: {
          en: {
            template: {
              id: 'campaign-template-id',
              name: 'proactive_campaign_template',
              language: 'en',
              status: 'APPROVED',
              category: 'MARKETING',
              components: [
                {
                  type: WhatsAppTemplateComponentType.BODY,
                  text: 'Your proactive campaign message.',
                },
              ],
              namespace: 'test-namespace',
              parameter_format: 'NAMED',
            },
            variable_values: {},
            url_variable_values: {},
          },
        },
        buttons: [],
      },
    },
    {
      id: 'fallback-node',
      code: 'FALLBACK',
      is_code_ai_generated: false,
      meta: { x: 0, y: -100 },
      follow_up: null,
      target: null,
      flow_id: 'fallback-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'fallback',
      content: {
        first_message: { id: 'fallback-message-node', type: 'text' },
        second_message: { id: 'fallback-message-node', type: 'text' },
        is_knowledge_base_active: false,
        knowledge_base_followup: null,
      },
    },
    {
      id: 'fallback-message-node',
      code: 'FALLBACK_MSG',
      is_code_ai_generated: false,
      meta: { x: 300, y: -100 },
      follow_up: null,
      target: null,
      flow_id: 'fallback-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [{ message: "Sorry, I didn't understand that.", locale: 'en' }],
        buttons_style: 'button',
        buttons: [],
      },
    },
  ],
  flows: [
    {
      id: 'main-flow',
      name: 'Main',
      start_node_id: 'main-start-node',
    },
    {
      id: 'campaign-template-flow',
      name: 'Proactive Template Campaign',
      start_node_id: 'campaign-template-start-node',
    },
    {
      id: 'fallback-flow',
      name: 'Fallback',
      start_node_id: 'fallback-node',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: [],
  campaigns: [
    {
      id: 'campaign-uuid-template',
      name: 'Proactive Template',
      start_node_id: 'campaign-template-start-node',
    },
  ],
}
