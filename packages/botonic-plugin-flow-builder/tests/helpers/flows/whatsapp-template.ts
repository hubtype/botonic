/* eslint-disable @typescript-eslint/naming-convention */
// Using inline constants to avoid import issues in test environment
const WhatsAppTemplateComponentType = {
  HEADER: 'HEADER',
  BODY: 'BODY',
  FOOTER: 'FOOTER',
  BUTTONS: 'BUTTONS',
  BUTTON: 'BUTTON',
} as const

const WhatsAppTemplateParameterType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
} as const

const WhatsAppTemplateButtonSubType = {
  URL: 'URL',
  QUICK_REPLY: 'QUICK_REPLY',
  PHONE_NUMBER: 'PHONE_NUMBER',
} as const

export const whatsappTemplateFlow = {
  version: 'draft',
  name: 'WhatsApp Template Test',
  comments: null,
  published_by: null,
  published_on: null,
  hash: 'whatsapp-template-test-hash',
  default_locale_code: 'en',
  locales: ['en', 'es'],
  translated_locales: [],
  start_node_id: 'start-node-id',
  ai_model_id: null,
  is_knowledge_base_active: false,
  nodes: [
    // Keyword to trigger WhatsApp template with text header
    {
      id: 'keyword-whatsapp-template-text-header',
      code: '',
      is_code_ai_generated: false,
      meta: { x: 0, y: 0 },
      follow_up: null,
      target: {
        id: 'whatsapp-template-text-header-node',
        type: 'whatsapp-template',
      },
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [{ values: ['templateTextHeader'], locale: 'en' }],
      },
    },
    // WhatsApp template with text header
    {
      id: 'whatsapp-template-text-header-node',
      code: 'WHATSAPP_TEMPLATE_TEXT_HEADER',
      is_code_ai_generated: false,
      meta: { x: 300, y: 0 },
      follow_up: null,
      target: null,
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-template',
      content: {
        template: {
          id: 'template-text-header-id',
          name: 'order_confirmation',
          language: 'en',
          status: 'APPROVED',
          category: 'MARKETING',
          components: [
            {
              type: WhatsAppTemplateComponentType.HEADER,
              format: WhatsAppTemplateParameterType.TEXT,
              text: 'Order {{1}}',
            },
            {
              type: WhatsAppTemplateComponentType.BODY,
              text: 'Hello {{customer_name}}, your order #{{order_id}} has been confirmed.',
            },
            {
              type: WhatsAppTemplateComponentType.FOOTER,
              text: 'Thank you for your purchase!',
            },
          ],
          namespace: 'test-namespace',
          parameter_format: 'NAMED',
        },
        header_variables: {
          type: WhatsAppTemplateParameterType.TEXT,
          text: { '1': '{orderNumber}' },
        },
        variable_values: {
          customer_name: '{session.user.extra_data.customerName}',
          order_id: 'ORD-12345',
        },
        buttons: [],
        url_variable_values: {},
      },
    },
    // Keyword to trigger WhatsApp template with image header
    {
      id: 'keyword-whatsapp-template-image-header',
      code: '',
      is_code_ai_generated: false,
      meta: { x: 0, y: 200 },
      follow_up: null,
      target: {
        id: 'whatsapp-template-image-header-node',
        type: 'whatsapp-template',
      },
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [
          { values: ['templateImageHeader'], locale: 'en' },
          { values: ['templateImageHeader'], locale: 'es' },
        ],
      },
    },
    // WhatsApp template with image header
    {
      id: 'whatsapp-template-image-header-node',
      code: 'WHATSAPP_TEMPLATE_IMAGE_HEADER',
      is_code_ai_generated: false,
      meta: { x: 300, y: 200 },
      follow_up: null,
      target: null,
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-template',
      content: {
        template: {
          id: 'template-image-header-id',
          name: 'promotional_offer',
          language: 'en',
          status: 'APPROVED',
          category: 'MARKETING',
          components: [
            {
              type: WhatsAppTemplateComponentType.HEADER,
              format: WhatsAppTemplateParameterType.IMAGE,
            },
            {
              type: WhatsAppTemplateComponentType.BODY,
              text: 'Check out our special offer: {{discount}}% off!',
            },
          ],
          namespace: 'test-namespace',
          parameter_format: 'NAMED',
        },
        header_variables: {
          type: WhatsAppTemplateParameterType.IMAGE,
          media: [
            {
              id: 'media-en-id',
              file: 'https://example.com/promo-en.jpg',
              locale: 'en',
            },
            {
              id: 'media-es-id',
              file: 'https://example.com/promo-es.jpg',
              locale: 'es',
            },
          ],
        },
        variable_values: {
          discount: '25',
        },
        buttons: [],
        url_variable_values: {},
      },
    },
    // Keyword to trigger WhatsApp template with buttons
    {
      id: 'keyword-whatsapp-template-buttons',
      code: '',
      is_code_ai_generated: false,
      meta: { x: 0, y: 400 },
      follow_up: null,
      target: {
        id: 'whatsapp-template-buttons-node',
        type: 'whatsapp-template',
      },
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [{ values: ['templateButtons'], locale: 'en' }],
      },
    },
    // WhatsApp template with buttons (URL, QUICK_REPLY, VOICE_CALL)
    {
      id: 'whatsapp-template-buttons-node',
      code: 'WHATSAPP_TEMPLATE_BUTTONS',
      is_code_ai_generated: false,
      meta: { x: 300, y: 400 },
      follow_up: {
        id: 'followup-text-node',
        type: 'text',
      },
      target: null,
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-template',
      content: {
        template: {
          id: 'template-buttons-id',
          name: 'support_options',
          language: 'en',
          status: 'APPROVED',
          category: 'UTILITY',
          components: [
            {
              type: WhatsAppTemplateComponentType.BODY,
              text: 'How can we help you today?',
            },
            {
              type: WhatsAppTemplateComponentType.BUTTONS,
              buttons: [
                {
                  type: WhatsAppTemplateButtonSubType.URL,
                  text: 'Visit Website',
                  url: 'https://example.com/support/{{1}}',
                  index: 0,
                },
                {
                  type: WhatsAppTemplateButtonSubType.QUICK_REPLY,
                  text: 'Talk to Agent',
                  id: 'quick-reply-agent',
                  index: 1,
                },
                {
                  type: WhatsAppTemplateButtonSubType.PHONE_NUMBER,
                  text: 'Call Support',
                  phone_number: '+1234567890',
                  index: 2,
                },
              ],
            },
          ],
          namespace: 'test-namespace',
          parameter_format: 'POSITIONAL',
        },
        header_variables: undefined,
        variable_values: {},
        buttons: [
          {
            id: 'url-button-id',
            text: [{ message: 'Visit Website', locale: 'en' }],
            url: [],
            target: null,
            hidden: [],
          },
          {
            id: 'quick-reply-button-id',
            text: [{ message: 'Talk to Agent', locale: 'en' }],
            url: [],
            target: {
              id: 'agent-handoff-node',
              type: 'handoff',
            },
            hidden: [],
          },
          {
            id: 'voice-call-button-id',
            text: [{ message: 'Call Support', locale: 'en' }],
            url: [],
            target: null,
            hidden: [],
          },
        ],
        url_variable_values: {
          '0': '{ticketId}',
        },
      },
    },
    // Follow-up text node
    {
      id: 'followup-text-node',
      code: 'FOLLOWUP_TEXT',
      is_code_ai_generated: false,
      meta: { x: 600, y: 400 },
      follow_up: null,
      target: null,
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [{ message: 'Thank you for your response!', locale: 'en' }],
        buttons_style: 'button',
        buttons: [],
      },
    },
    // Agent handoff node for quick reply button target
    {
      id: 'agent-handoff-node',
      code: 'AGENT_HANDOFF',
      is_code_ai_generated: false,
      meta: { x: 600, y: 500 },
      follow_up: null,
      target: null,
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'handoff',
      content: {
        queue: [{ id: 'support-queue-id', name: 'Support', locale: 'en' }],
        payload: [],
        has_auto_assign: false,
        has_queue_position_changed_notifications_enabled: false,
      },
    },
    // Keyword to trigger WhatsApp template without header
    {
      id: 'keyword-whatsapp-template-no-header',
      code: '',
      is_code_ai_generated: false,
      meta: { x: 0, y: 600 },
      follow_up: null,
      target: {
        id: 'whatsapp-template-no-header-node',
        type: 'whatsapp-template',
      },
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'keyword',
      content: {
        title: [],
        keywords: [{ values: ['templateNoHeader'], locale: 'en' }],
      },
    },
    // WhatsApp template without header
    {
      id: 'whatsapp-template-no-header-node',
      code: 'WHATSAPP_TEMPLATE_NO_HEADER',
      is_code_ai_generated: false,
      meta: { x: 300, y: 600 },
      follow_up: null,
      target: null,
      flow_id: 'main-flow',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'whatsapp-template',
      content: {
        template: {
          id: 'template-no-header-id',
          name: 'simple_notification',
          language: 'en',
          status: 'APPROVED',
          category: 'UTILITY',
          components: [
            {
              type: WhatsAppTemplateComponentType.BODY,
              text: 'Your appointment is scheduled for {{date}} at {{time}}.',
            },
          ],
          namespace: 'test-namespace',
          parameter_format: 'NAMED',
        },
        header_variables: undefined,
        variable_values: {
          date: '2024-01-15',
          time: '10:00 AM',
        },
        buttons: [],
        url_variable_values: {},
      },
    },
    // Fallback node
    {
      id: 'fallback-node',
      code: 'FALLBACK',
      is_code_ai_generated: false,
      meta: { x: 300, y: -100 },
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
    // Fallback message
    {
      id: 'fallback-message-node',
      code: 'FALLBACK_MSG',
      is_code_ai_generated: false,
      meta: { x: 600, y: -100 },
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
      start_node_id: 'keyword-whatsapp-template-text-header',
    },
    {
      id: 'fallback-flow',
      name: 'Fallback',
      start_node_id: 'fallback-node',
    },
  ],
  webviews: [],
  webview_contents: [],
  bot_variables: ['orderNumber', 'customerName', 'ticketId'],
  campaigns: [],
}
