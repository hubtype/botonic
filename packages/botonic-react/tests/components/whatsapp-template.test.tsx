import { describe, expect, test } from '@jest/globals'
import TestRenderer from 'react-test-renderer'

import { WhatsappTemplate } from '../../src/components/whatsapp-template/index'
import {
  WhatsAppTemplateButtonSubType,
  WhatsAppTemplateComponentType,
  WhatsAppTemplateParameterType,
} from '../../src/components/whatsapp-template/types'

const renderToJSON = (sut: React.ReactElement) =>
  TestRenderer.create(sut).toJSON()

describe('WhatsappTemplate Component', () => {
  test('renders WhatsappTemplate with minimal props', () => {
    const props = {
      name: 'order_confirmation',
      language: 'en',
    }

    const tree = renderToJSON(<WhatsappTemplate {...props} />)
    expect(tree).toMatchSnapshot()
  })

  test('renders WhatsappTemplate with namespace', () => {
    const props = {
      name: 'order_confirmation',
      language: 'en',
      namespace: 'my_business_namespace',
    }

    const tree = renderToJSON(<WhatsappTemplate {...props} />)
    expect(tree).toMatchSnapshot()
  })

  test('renders WhatsappTemplate with text header', () => {
    const props = {
      name: 'order_confirmation',
      language: 'en',
      header: {
        type: WhatsAppTemplateComponentType.HEADER,
        parameters: [
          {
            type: WhatsAppTemplateParameterType.TEXT,
            text: 'Order #12345',
          },
        ],
      },
    }

    const tree = renderToJSON(<WhatsappTemplate {...props} />)
    expect(tree).toMatchSnapshot()
  })

  test('renders WhatsappTemplate with image header', () => {
    const props = {
      name: 'promotional_offer',
      language: 'es',
      header: {
        type: WhatsAppTemplateComponentType.HEADER,
        parameters: [
          {
            type: WhatsAppTemplateParameterType.IMAGE,
            image: {
              link: 'https://example.com/promo-image.jpg',
            },
          },
        ],
      },
    }

    const tree = renderToJSON(<WhatsappTemplate {...props} />)
    expect(tree).toMatchSnapshot()
  })

  test('renders WhatsappTemplate with body parameters', () => {
    const props = {
      name: 'shipping_update',
      language: 'en',
      body: {
        type: WhatsAppTemplateComponentType.BODY,
        parameters: [
          {
            type: WhatsAppTemplateParameterType.TEXT,
            parameter_name: 'customer_name',
            text: 'John Doe',
          },
          {
            type: WhatsAppTemplateParameterType.TEXT,
            parameter_name: 'tracking_number',
            text: 'TRK-123456789',
          },
        ],
      },
    }

    const tree = renderToJSON(<WhatsappTemplate {...props} />)
    expect(tree).toMatchSnapshot()
  })

  test('renders WhatsappTemplate with quick reply buttons', () => {
    const props = {
      name: 'customer_feedback',
      language: 'en',
      buttons: {
        type: WhatsAppTemplateComponentType.BUTTONS,
        buttons: [
          {
            type: WhatsAppTemplateComponentType.BUTTON,
            sub_type: WhatsAppTemplateButtonSubType.QUICK_REPLY,
            index: 0,
            parameters: [
              {
                type: WhatsAppTemplateParameterType.PAYLOAD,
                payload: 'feedback_positive',
              },
            ],
          },
          {
            type: WhatsAppTemplateComponentType.BUTTON,
            sub_type: WhatsAppTemplateButtonSubType.QUICK_REPLY,
            index: 1,
            parameters: [
              {
                type: WhatsAppTemplateParameterType.PAYLOAD,
                payload: 'feedback_negative',
              },
            ],
          },
        ],
      },
    }

    const tree = renderToJSON(<WhatsappTemplate {...props} />)
    expect(tree).toMatchSnapshot()
  })

  test('renders WhatsappTemplate with URL button', () => {
    const props = {
      name: 'order_details',
      language: 'en',
      buttons: {
        type: WhatsAppTemplateComponentType.BUTTONS,
        buttons: [
          {
            type: WhatsAppTemplateComponentType.BUTTON,
            sub_type: WhatsAppTemplateButtonSubType.URL,
            index: 0,
            parameters: [
              {
                type: WhatsAppTemplateParameterType.TEXT,
                text: 'order-123',
              },
            ],
          },
        ],
      },
    }

    const tree = renderToJSON(<WhatsappTemplate {...props} />)
    expect(tree).toMatchSnapshot()
  })

  test('renders WhatsappTemplate with all components (header, body, buttons)', () => {
    const props = {
      name: 'support_ticket',
      language: 'en',
      namespace: 'business_namespace',
      header: {
        type: WhatsAppTemplateComponentType.HEADER,
        parameters: [
          {
            type: WhatsAppTemplateParameterType.TEXT,
            text: 'Ticket #TKT-001',
          },
        ],
      },
      body: {
        type: WhatsAppTemplateComponentType.BODY,
        parameters: [
          {
            type: WhatsAppTemplateParameterType.TEXT,
            parameter_name: 'issue_description',
            text: 'Unable to login to account',
          },
          {
            type: WhatsAppTemplateParameterType.TEXT,
            parameter_name: 'priority',
            text: 'High',
          },
        ],
      },
      buttons: {
        type: WhatsAppTemplateComponentType.BUTTONS,
        buttons: [
          {
            type: WhatsAppTemplateComponentType.BUTTON,
            sub_type: WhatsAppTemplateButtonSubType.URL,
            index: 0,
            parameters: [
              {
                type: WhatsAppTemplateParameterType.TEXT,
                text: 'TKT-001',
              },
            ],
          },
          {
            type: WhatsAppTemplateComponentType.BUTTON,
            sub_type: WhatsAppTemplateButtonSubType.QUICK_REPLY,
            index: 1,
            parameters: [
              {
                type: WhatsAppTemplateParameterType.PAYLOAD,
                payload: 'talk_to_agent',
              },
            ],
          },
        ],
      },
    }

    const tree = renderToJSON(<WhatsappTemplate {...props} />)
    expect(tree).toMatchSnapshot()
  })
})

describe('WhatsApp Template Types', () => {
  test('WhatsAppTemplateButtonSubType has correct values', () => {
    expect(WhatsAppTemplateButtonSubType.URL).toBe('URL')
    expect(WhatsAppTemplateButtonSubType.QUICK_REPLY).toBe('QUICK_REPLY')
    expect(WhatsAppTemplateButtonSubType.PHONE_NUMBER).toBe('PHONE_NUMBER')
    expect(WhatsAppTemplateButtonSubType.VOICE_CALL).toBe('VOICE_CALL')
  })

  test('WhatsAppTemplateParameterType has correct values', () => {
    expect(WhatsAppTemplateParameterType.PAYLOAD).toBe('PAYLOAD')
    expect(WhatsAppTemplateParameterType.TEXT).toBe('TEXT')
    expect(WhatsAppTemplateParameterType.IMAGE).toBe('IMAGE')
    expect(WhatsAppTemplateParameterType.VIDEO).toBe('VIDEO')
    expect(WhatsAppTemplateParameterType.DOCUMENT).toBe('DOCUMENT')
  })

  test('WhatsAppTemplateComponentType has correct values', () => {
    expect(WhatsAppTemplateComponentType.HEADER).toBe('HEADER')
    expect(WhatsAppTemplateComponentType.BODY).toBe('BODY')
    expect(WhatsAppTemplateComponentType.FOOTER).toBe('FOOTER')
    expect(WhatsAppTemplateComponentType.BUTTONS).toBe('BUTTONS')
    expect(WhatsAppTemplateComponentType.BUTTON).toBe('BUTTON')
  })
})
