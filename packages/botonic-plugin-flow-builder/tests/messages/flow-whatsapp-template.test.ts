import { INPUT, PROVIDER } from '@botonic/core'
import {
  WhatsAppTemplateButtonSubType,
  WhatsAppTemplateComponentType,
  WhatsAppTemplateParameterType,
} from '@botonic/react'
import { describe, expect, test } from '@jest/globals'

import { FlowWhatsappTemplate } from '../../src/content-fields/flow-whatsapp-template'
import {
  HtNodeWithContentType,
  type HtWhatsappTemplateNode,
} from '../../src/content-fields/hubtype-fields'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { whatsappTemplateFlow } from '../helpers/flows/whatsapp-template'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('FlowWhatsappTemplate', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  describe('fromHubtypeCMS', () => {
    test('should create instance from HtWhatsappTemplateNode with all properties', () => {
      const mockNode: HtWhatsappTemplateNode = {
        id: 'test-node-id',
        code: 'TEST_TEMPLATE',
        meta: { x: 0, y: 0 },
        follow_up: { id: 'followup-id', type: HtNodeWithContentType.TEXT },
        target: undefined,
        flow_id: 'test-flow',
        is_meaningful: false,
        type: HtNodeWithContentType.WHATSAPP_TEMPLATE,
        content: {
          template: {
            id: 'template-id',
            name: 'test_template',
            language: 'en',
            status: 'APPROVED',
            category: 'MARKETING',
            components: [
              {
                type: WhatsAppTemplateComponentType.BODY,
                text: 'Hello {{name}}!',
              },
            ],
            namespace: 'test-namespace',
            parameter_format: 'NAMED',
          },
          header_variables: {
            type: WhatsAppTemplateParameterType.TEXT,
            text: { '1': 'Header Value' },
          },
          variable_values: { name: 'John' },
          buttons: [
            {
              id: 'button-id',
              text: [{ message: 'Click me', locale: 'en' }],
              url: [],
              target: { id: 'target-id', type: HtNodeWithContentType.TEXT },
              hidden: [],
            },
          ],
          url_variable_values: { '0': 'param-value' },
        },
      }

      const flowWhatsappTemplate = FlowWhatsappTemplate.fromHubtypeCMS(mockNode)

      expect(flowWhatsappTemplate.id).toBe('test-node-id')
      expect(flowWhatsappTemplate.code).toBe('TEST_TEMPLATE')
      expect(flowWhatsappTemplate.htWhatsappTemplate.name).toBe('test_template')
      expect(flowWhatsappTemplate.htWhatsappTemplate.language).toBe('en')
      expect(flowWhatsappTemplate.variableValues).toEqual({ name: 'John' })
      expect(flowWhatsappTemplate.headerVariables?.type).toBe(
        WhatsAppTemplateParameterType.TEXT
      )
      expect(flowWhatsappTemplate.buttons).toHaveLength(1)
      expect(flowWhatsappTemplate.urlVariableValues).toEqual({
        '0': 'param-value',
      })
      expect(flowWhatsappTemplate.followUp).toEqual({
        id: 'followup-id',
        type: HtNodeWithContentType.TEXT,
      })
    })

    test('should handle node without header_variables', () => {
      const mockNode: HtWhatsappTemplateNode = {
        id: 'test-node-id',
        code: 'TEST_TEMPLATE',
        meta: { x: 0, y: 0 },
        follow_up: undefined,
        target: undefined,
        flow_id: 'test-flow',
        is_meaningful: false,
        type: HtNodeWithContentType.WHATSAPP_TEMPLATE,
        content: {
          template: {
            id: 'template-id',
            name: 'simple_template',
            language: 'es',
            status: 'APPROVED',
            category: 'UTILITY',
            components: [],
            namespace: 'test-namespace',
            parameter_format: 'NAMED',
          },
          variable_values: {},
          buttons: [],
        },
      }

      const flowWhatsappTemplate = FlowWhatsappTemplate.fromHubtypeCMS(mockNode)

      expect(flowWhatsappTemplate.headerVariables).toBeUndefined()
      expect(flowWhatsappTemplate.urlVariableValues).toBeUndefined()
    })
  })

  describe('Integration tests with flow builder', () => {
    test('should get WhatsApp template content with text header', async () => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateTextHeader', type: INPUT.TEXT },
        },
      })

      expect(contents).toHaveLength(1)
      const template = contents[0] as FlowWhatsappTemplate
      expect(template).toBeInstanceOf(FlowWhatsappTemplate)
      expect(template.htWhatsappTemplate.name).toBe('order_confirmation')
      expect(template.htWhatsappTemplate.language).toBe('en')
      expect(template.headerVariables?.type).toBe(
        WhatsAppTemplateParameterType.TEXT
      )
    })

    test('should get WhatsApp template content with image header', async () => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateImageHeader', type: INPUT.TEXT },
        },
      })

      expect(contents).toHaveLength(1)
      const template = contents[0] as FlowWhatsappTemplate
      expect(template.htWhatsappTemplate.name).toBe('promotional_offer')
      expect(template.headerVariables?.type).toBe(
        WhatsAppTemplateParameterType.IMAGE
      )
      expect(template.headerVariables?.media).toHaveLength(2)
    })

    test('should get WhatsApp template content with video header', async () => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateVideoHeader', type: INPUT.TEXT },
        },
      })

      expect(contents).toHaveLength(1)
      const template = contents[0] as FlowWhatsappTemplate
      expect(template.htWhatsappTemplate.name).toBe('video_promo')
      expect(template.headerVariables?.type).toBe(
        WhatsAppTemplateParameterType.VIDEO
      )
      expect(template.headerVariables?.media).toHaveLength(2)
    })

    test('should get WhatsApp template content with buttons', async () => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateButtons', type: INPUT.TEXT },
        },
      })

      // 2 contents: WhatsApp template + follow-up text
      expect(contents).toHaveLength(2)
      const template = contents[0] as FlowWhatsappTemplate
      expect(template.htWhatsappTemplate.name).toBe('support_options')
      expect(template.buttons).toHaveLength(3)
      expect(template.urlVariableValues).toEqual({ '0': '{ticketId}' })
      expect(template.followUp).toEqual({
        id: 'followup-text-node',
        type: 'text',
      })
    })

    test('should get WhatsApp template content without header', async () => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateNoHeader', type: INPUT.TEXT },
        },
      })

      expect(contents).toHaveLength(1)
      const template = contents[0] as FlowWhatsappTemplate
      expect(template.htWhatsappTemplate.name).toBe('simple_notification')
      expect(template.headerVariables).toBeUndefined()
    })

    test('should replace variables in body component', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateTextHeader', type: INPUT.TEXT },
            extraData: { customerName: 'Alice' },
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      // @ts-expect-error - accessing private method for testing
      const bodyComponent = template.getBodyComponent(
        template.variableValues,
        request
      )

      expect(bodyComponent.type).toBe(WhatsAppTemplateComponentType.BODY)
      expect(bodyComponent.parameters).toHaveLength(2)

      // The customer_name should be replaced with the extraData value
      const customerNameParam = bodyComponent.parameters.find(
        p => p.parameter_name === 'customer_name'
      )
      expect(customerNameParam?.text).toBe('Alice')

      // The order_id should remain as static value
      const orderIdParam = bodyComponent.parameters.find(
        p => p.parameter_name === 'order_id'
      )
      expect(orderIdParam?.text).toBe('ORD-12345')
    })

    test('should replace variables in header text component', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateTextHeader', type: INPUT.TEXT },
            extraData: { orderNumber: 'ORD-99999' },
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      // @ts-expect-error - accessing private method for testing
      const headerComponent = template.getHeaderComponent(
        template.htWhatsappTemplate,
        template.headerVariables!,
        'en',
        request
      )

      expect(headerComponent?.type).toBe(WhatsAppTemplateComponentType.HEADER)
      // @ts-expect-error - text property exists for TEXT type headers
      expect(headerComponent?.parameters[0].text).toBe('ORD-99999')
    })

    test('should create image header with correct locale', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateImageHeader', type: INPUT.TEXT },
            user: { locale: 'es', country: 'ES', systemLocale: 'es' },
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      // @ts-expect-error - accessing private method for testing
      const headerComponent = template.getHeaderComponent(
        template.htWhatsappTemplate,
        template.headerVariables!,
        'es',
        request
      )

      expect(headerComponent?.type).toBe(WhatsAppTemplateComponentType.HEADER)
      expect(headerComponent?.parameters[0].type).toBe(
        WhatsAppTemplateParameterType.IMAGE
      )
      // @ts-expect-error
      expect(headerComponent?.parameters[0].image.link).toBe(
        'https://example.com/promo-es.jpg'
      )
    })

    test('should create video header with correct locale', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateVideoHeader', type: INPUT.TEXT },
            user: { locale: 'es', country: 'ES', systemLocale: 'es' },
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      // @ts-expect-error - accessing private method for testing
      const headerComponent = template.getHeaderComponent(
        template.htWhatsappTemplate,
        template.headerVariables!,
        'es',
        request
      )

      expect(headerComponent?.type).toBe(WhatsAppTemplateComponentType.HEADER)
      expect(headerComponent?.parameters[0].type).toBe(
        WhatsAppTemplateParameterType.VIDEO
      )
      // @ts-expect-error
      expect(headerComponent?.parameters[0].video.link).toBe(
        'https://example.com/video-es.mp4'
      )
    })

    test('should return undefined header when no header component exists', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateNoHeader', type: INPUT.TEXT },
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      // @ts-expect-error - accessing private method for testing
      const headerComponent = template.getHeaderComponent(
        template.htWhatsappTemplate,
        {} as any,
        'en',
        request
      )

      expect(headerComponent).toBeUndefined()
    })
  })

  describe('Button component generation', () => {
    test('should create URL button with variable replacement', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateButtons', type: INPUT.TEXT },
            extraData: { ticketId: 'TKT-12345' },
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      // @ts-expect-error - accessing private method for testing
      const buttons = template.getButtons(
        template.htWhatsappTemplate,
        template.buttons!,
        template.urlVariableValues!,
        request
      )

      expect(buttons?.type).toBe(WhatsAppTemplateComponentType.BUTTONS)
      expect(buttons?.buttons).toHaveLength(3)

      // URL button
      const urlButton = buttons?.buttons[0]
      expect(urlButton?.sub_type).toBe(WhatsAppTemplateButtonSubType.URL)
      expect(urlButton?.index).toBe(0)
      // @ts-expect-error
      expect(urlButton?.parameters[0].text).toBe('TKT-12345')

      // Quick Reply button
      const quickReplyButton = buttons?.buttons[1]
      expect(quickReplyButton?.sub_type).toBe(
        WhatsAppTemplateButtonSubType.QUICK_REPLY
      )
      expect(quickReplyButton?.index).toBe(1)
      // @ts-expect-error
      expect(quickReplyButton?.parameters[0].payload).toBe('agent-handoff-node')

      // Voice Call button (maps to default since PHONE_NUMBER is not handled separately)
      const voiceCallButton = buttons?.buttons[2]
      expect(voiceCallButton?.sub_type).toBe(
        WhatsAppTemplateButtonSubType.VOICE_CALL
      )
      expect(voiceCallButton?.index).toBe(2)
    })

    test('should filter out URL buttons without urlParam', async () => {
      const mockNode: HtWhatsappTemplateNode = {
        id: 'test-node-id',
        code: 'TEST_TEMPLATE',
        meta: { x: 0, y: 0 },
        follow_up: undefined,
        target: undefined,
        flow_id: 'test-flow',
        is_meaningful: false,
        type: HtNodeWithContentType.WHATSAPP_TEMPLATE,
        content: {
          template: {
            id: 'template-id',
            name: 'test_template',
            language: 'en',
            status: 'APPROVED',
            category: 'MARKETING',
            components: [
              {
                type: WhatsAppTemplateComponentType.BUTTONS,
                buttons: [
                  {
                    type: WhatsAppTemplateButtonSubType.URL,
                    text: 'Visit',
                    url: 'https://example.com/{{1}}',
                    index: 0,
                  },
                  {
                    type: WhatsAppTemplateButtonSubType.QUICK_REPLY,
                    text: 'OK',
                    id: 'ok-id',
                    index: 1,
                  },
                ],
              },
            ],
            namespace: 'test-namespace',
            parameter_format: 'POSITIONAL',
          },
          variable_values: {},
          buttons: [
            {
              id: 'url-btn',
              text: [{ message: 'Visit', locale: 'en' }],
              url: [],
              target: undefined,
              hidden: [],
            },
            {
              id: 'ok-btn',
              text: [{ message: 'OK', locale: 'en' }],
              url: [],
              target: { id: 'ok-target', type: HtNodeWithContentType.TEXT },
              hidden: [],
            },
          ],
          url_variable_values: {}, // Empty - no URL params
        },
      }

      const { request } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateNoHeader', type: INPUT.TEXT },
        },
      })

      const template = FlowWhatsappTemplate.fromHubtypeCMS(mockNode)
      // @ts-expect-error - accessing private method for testing
      const buttons = template.getButtons(
        template.htWhatsappTemplate,
        template.buttons!,
        template.urlVariableValues || {},
        request
      )

      // URL button should be filtered out because no urlParam
      expect(buttons?.buttons).toHaveLength(1)
      expect(buttons?.buttons[0].sub_type).toBe(
        WhatsAppTemplateButtonSubType.QUICK_REPLY
      )
    })

    test('should return undefined when no buttons component exists', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateNoHeader', type: INPUT.TEXT },
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      // @ts-expect-error - accessing private method for testing
      const buttons = template.getButtons(
        template.htWhatsappTemplate,
        [],
        {},
        request
      )

      expect(buttons).toBeUndefined()
    })
  })

  describe('toBotonic rendering', () => {
    test('should render Text fallback for non-WhatsApp sessions (webchat)', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateTextHeader', type: INPUT.TEXT },
            provider: PROVIDER.WEBCHAT,
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      const rendered = template.toBotonic('test-id', request)

      // For non-WhatsApp, it should render a Text component with template info
      expect(rendered.type.name || rendered.type).toBe('Text')
      expect(rendered.props.children[0]).toContain(
        'WhatsApp Template: order_confirmation (en)'
      )
    })

    test('should render WhatsappTemplate for WhatsApp sessions', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateTextHeader', type: INPUT.TEXT },
            provider: PROVIDER.WHATSAPP,
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      const rendered = template.toBotonic('test-id', request)

      // For WhatsApp, it should render a WhatsappTemplate component
      expect(rendered.type.name || rendered.type).toBe('WhatsappTemplate')
      expect(rendered.props.name).toBe('order_confirmation')
      expect(rendered.props.language).toBe('en')
    })
  })
})
