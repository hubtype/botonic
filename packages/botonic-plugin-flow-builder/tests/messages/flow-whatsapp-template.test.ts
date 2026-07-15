import { INPUT, PROVIDER } from '@botonic/core'
import {
  WhatsAppTemplateButtonSubType,
  WhatsAppTemplateComponentType,
  WhatsAppTemplateParameterType,
  type WhatsappTemplateFlowButton,
  type WhatsappTemplateHeaderImageParameter,
  type WhatsappTemplateHeaderTextParameter,
  type WhatsappTemplateHeaderVideoParameter,
  type WhatsappTemplatePhoneNumberButton,
  type WhatsappTemplateQuickReplyButton,
  type WhatsappTemplateUrlButton,
} from '@botonic/react'
import { describe, expect, test } from '@jest/globals'

import { FlowWhatsappTemplate } from '../../src/content-fields/flow-whatsapp-template'
import { HtNodeWithContentType } from '../../src/content-fields/hubtype-fields/node-types'
import type { HtWhatsappTemplateNode } from '../../src/content-fields/hubtype-fields/whatsapp-template'
import { HtWhatsAppTemplateFlowActionType } from '../../src/content-fields/hubtype-fields/whatsapp-template'
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
          by_locale: {
            en: {
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
              url_variable_values: { '0': 'param-value' },
            },
          },
          buttons: [
            {
              id: 'button-id',
              text: [{ message: 'Click me', locale: 'en' }],
              url: [],
              target: { id: 'target-id', type: HtNodeWithContentType.TEXT },
              hidden: [],
            },
          ],
        },
      }

      const flowWhatsappTemplate = FlowWhatsappTemplate.fromHubtypeCMS(
        mockNode,
        'en'
      )

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

    test('should throw an error when content is not found for the requested locale', () => {
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
          by_locale: {
            en: {
              template: {
                id: 'template-id',
                name: 'test_template',
                language: 'en',
                status: 'APPROVED',
                category: 'MARKETING',
                components: [],
                namespace: 'test-namespace',
                parameter_format: 'NAMED',
              },
              variable_values: {},
            },
          },
          buttons: [],
        },
      }

      expect(() => FlowWhatsappTemplate.fromHubtypeCMS(mockNode, 'fr')).toThrow(
        'Whatsapp template content not found for locale: fr'
      )
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
          by_locale: {
            es: {
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
            },
          },
          buttons: [],
        },
      }

      const flowWhatsappTemplate = FlowWhatsappTemplate.fromHubtypeCMS(
        mockNode,
        'es'
      )

      expect(flowWhatsappTemplate.headerVariables).toBeUndefined()
      expect(flowWhatsappTemplate.urlVariableValues).toBeUndefined()
    })

    test('should throw when template is not configured for locale', () => {
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
          by_locale: {
            en: {
              variable_values: {},
            },
          },
          buttons: [],
        },
      }

      expect(() => FlowWhatsappTemplate.fromHubtypeCMS(mockNode, 'en')).toThrow(
        'Whatsapp template not configured for locale: en'
      )
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
      expect(
        (headerComponent?.parameters[0] as WhatsappTemplateHeaderTextParameter)
          .text
      ).toBe('ORD-99999')
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
      expect(
        (headerComponent?.parameters[0] as WhatsappTemplateHeaderImageParameter)
          .image.link
      ).toBe('https://example.com/promo-es.jpg')
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
      expect(
        (headerComponent?.parameters[0] as WhatsappTemplateHeaderVideoParameter)
          .video.link
      ).toBe('https://example.com/video-es.mp4')
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
        template.flowButtonActionValues || {},
        request
      )

      expect(buttons?.type).toBe(WhatsAppTemplateComponentType.BUTTONS)
      expect(buttons?.buttons).toHaveLength(3)

      // URL button
      const urlButton = buttons?.buttons[0]
      expect(urlButton?.sub_type).toBe(WhatsAppTemplateButtonSubType.URL)
      expect(urlButton?.index).toBe(0)
      expect((urlButton as WhatsappTemplateUrlButton)?.parameters[0].text).toBe(
        'TKT-12345'
      )

      // Quick Reply button
      const quickReplyButton = buttons?.buttons[1]
      expect(quickReplyButton?.sub_type).toBe(
        WhatsAppTemplateButtonSubType.QUICK_REPLY
      )
      expect(quickReplyButton?.index).toBe(1)
      expect(
        (quickReplyButton as WhatsappTemplateQuickReplyButton)?.parameters[0]
          .payload
      ).toBe('agent-handoff-node')

      // Phone Number button
      const phoneNumberButton = buttons?.buttons[2]
      expect(phoneNumberButton?.sub_type).toBe(
        WhatsAppTemplateButtonSubType.PHONE_NUMBER
      )
      expect(phoneNumberButton?.index).toBe(2)
      expect(
        (phoneNumberButton as WhatsappTemplatePhoneNumberButton)?.parameters
      ).toEqual([])
    })

    test('should create FLOW button with flow_token and flow_action_data variable replacement', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: whatsappTemplateFlow },
          requestArgs: {
            input: { data: 'templateFlowButton', type: INPUT.TEXT },
            extraData: { ticketId: 'TKT-FLOW-99' },
          },
        }
      )

      const template = contents[0] as FlowWhatsappTemplate
      expect(template.flowButtonActionValues).toEqual({
        '3': {
          flow_token: 'static-booking-token',
          flow_action_data: {
            ticket_id: '{ticketId}',
          },
        },
      })

      // @ts-expect-error - accessing private method for testing
      const buttons = template.getButtons(
        template.htWhatsappTemplate,
        template.buttons!,
        template.urlVariableValues || {},
        template.flowButtonActionValues || {},
        request
      )

      expect(buttons?.buttons).toHaveLength(4)

      const flowButton = buttons?.buttons[3] as WhatsappTemplateFlowButton
      expect(flowButton.sub_type).toBe(WhatsAppTemplateButtonSubType.FLOW)
      expect(flowButton.index).toBe('3')
      expect(flowButton.parameters[0].type).toBe(
        WhatsAppTemplateParameterType.ACTION
      )
      expect(flowButton.parameters[0].action).toEqual({
        flow_token: 'static-booking-token',
        flow_action_data: {
          ticket_id: 'TKT-FLOW-99',
        },
      })
    })

    test('should create FLOW button without flow_action_data when optional', async () => {
      const mockNode: HtWhatsappTemplateNode = {
        id: 'test-flow-node-id',
        code: 'TEST_FLOW_TEMPLATE',
        meta: { x: 0, y: 0 },
        follow_up: undefined,
        target: undefined,
        flow_id: 'test-flow',
        is_meaningful: false,
        type: HtNodeWithContentType.WHATSAPP_TEMPLATE,
        content: {
          by_locale: {
            en: {
              template: {
                id: 'template-id',
                name: 'navigate_only_template',
                language: 'en',
                status: 'APPROVED',
                category: 'UTILITY',
                components: [
                  {
                    type: WhatsAppTemplateComponentType.BUTTONS,
                    buttons: [
                      {
                        type: WhatsAppTemplateButtonSubType.FLOW,
                        text: 'Open Flow',
                        flow_id: 'meta-flow-id',
                        flow_action: HtWhatsAppTemplateFlowActionType.NAVIGATE,
                        index: 0,
                      },
                    ],
                  },
                ],
                namespace: 'test-namespace',
                parameter_format: 'POSITIONAL',
              },
              variable_values: {},
              flow_button_action_values: {
                '0': {
                  flow_token: 'token-only',
                },
              },
            },
          },
          buttons: [],
        },
      }

      const { request } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateNoHeader', type: INPUT.TEXT },
        },
      })

      const template = FlowWhatsappTemplate.fromHubtypeCMS(mockNode, 'en')
      // @ts-expect-error - accessing private method for testing
      const buttons = template.getButtons(
        template.htWhatsappTemplate,
        template.buttons || [],
        {},
        template.flowButtonActionValues || {},
        request
      )

      const flowButton = buttons?.buttons[0] as WhatsappTemplateFlowButton
      expect(flowButton.index).toBe('0')
      expect(flowButton.parameters[0].action).toEqual({
        flow_token: 'token-only',
      })
    })

    test('should omit flow_action_data for data_exchange template buttons', async () => {
      const mockNode: HtWhatsappTemplateNode = {
        id: 'test-flow-node-id',
        code: 'TEST_FLOW_TEMPLATE',
        meta: { x: 0, y: 0 },
        follow_up: undefined,
        target: undefined,
        flow_id: 'test-flow',
        is_meaningful: false,
        type: HtNodeWithContentType.WHATSAPP_TEMPLATE,
        content: {
          by_locale: {
            en: {
              template: {
                id: 'template-id',
                name: 'data_exchange_template',
                language: 'en',
                status: 'APPROVED',
                category: 'UTILITY',
                components: [
                  {
                    type: WhatsAppTemplateComponentType.BUTTONS,
                    buttons: [
                      {
                        type: WhatsAppTemplateButtonSubType.FLOW,
                        text: 'Open Flow',
                        flow_id: 'meta-flow-id',
                        flow_action:
                          HtWhatsAppTemplateFlowActionType.DATA_EXCHANGE,
                        index: 0,
                      },
                    ],
                  },
                ],
                namespace: 'test-namespace',
                parameter_format: 'POSITIONAL',
              },
              variable_values: {},
              flow_button_action_values: {
                '0': {
                  flow_token: 'static-data-token',
                  flow_action_data: {
                    customer_id: 'should-be-omitted',
                  },
                },
              },
            },
          },
          buttons: [
            {
              id: 'flow-btn',
              text: [{ message: 'Open Flow', locale: 'en' }],
              url: [],
              target: undefined,
              hidden: [],
            },
          ],
        },
      }

      const { request } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateNoHeader', type: INPUT.TEXT },
        },
      })

      const template = FlowWhatsappTemplate.fromHubtypeCMS(mockNode, 'en')
      // @ts-expect-error - accessing private method for testing
      const buttons = template.getButtons(
        template.htWhatsappTemplate,
        template.buttons!,
        {},
        template.flowButtonActionValues || {},
        request
      )

      const flowButton = buttons?.buttons[0] as WhatsappTemplateFlowButton
      expect(flowButton.parameters[0].action).toEqual({
        flow_token: 'static-data-token',
      })
    })

    test('should throw when FLOW button is missing flow_button_action_values', async () => {
      const mockNode: HtWhatsappTemplateNode = {
        id: 'test-flow-node-id',
        code: 'TEST_FLOW_TEMPLATE',
        meta: { x: 0, y: 0 },
        follow_up: undefined,
        target: undefined,
        flow_id: 'test-flow',
        is_meaningful: false,
        type: HtNodeWithContentType.WHATSAPP_TEMPLATE,
        content: {
          by_locale: {
            en: {
              template: {
                id: 'template-id',
                name: 'missing_flow_values',
                language: 'en',
                status: 'APPROVED',
                category: 'UTILITY',
                components: [
                  {
                    type: WhatsAppTemplateComponentType.BUTTONS,
                    buttons: [
                      {
                        type: WhatsAppTemplateButtonSubType.FLOW,
                        text: 'Open Flow',
                        flow_id: 'meta-flow-id',
                        flow_action:
                          HtWhatsAppTemplateFlowActionType.DATA_EXCHANGE,
                        index: 0,
                      },
                    ],
                  },
                ],
                namespace: 'test-namespace',
                parameter_format: 'POSITIONAL',
              },
              variable_values: {},
            },
          },
          buttons: [],
        },
      }

      const { request } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateNoHeader', type: INPUT.TEXT },
        },
      })

      const template = FlowWhatsappTemplate.fromHubtypeCMS(mockNode, 'en')

      expect(() =>
        // @ts-expect-error - accessing private method for testing
        template.getButtons(
          template.htWhatsappTemplate,
          template.buttons || [],
          {},
          {},
          request
        )
      ).toThrow(
        "WhatsApp template 'missing_flow_values' FLOW button at index 0 requires flow_button_action_values"
      )
    })

    test('should throw when FLOW button has empty flow_token', async () => {
      const mockNode: HtWhatsappTemplateNode = {
        id: 'test-flow-node-id',
        code: 'TEST_FLOW_TEMPLATE',
        meta: { x: 0, y: 0 },
        follow_up: undefined,
        target: undefined,
        flow_id: 'test-flow',
        is_meaningful: false,
        type: HtNodeWithContentType.WHATSAPP_TEMPLATE,
        content: {
          by_locale: {
            en: {
              template: {
                id: 'template-id',
                name: 'empty_flow_token',
                language: 'en',
                status: 'APPROVED',
                category: 'UTILITY',
                components: [
                  {
                    type: WhatsAppTemplateComponentType.BUTTONS,
                    buttons: [
                      {
                        type: WhatsAppTemplateButtonSubType.FLOW,
                        text: 'Open Flow',
                        flow_id: 'meta-flow-id',
                        flow_action:
                          HtWhatsAppTemplateFlowActionType.DATA_EXCHANGE,
                        index: 0,
                      },
                    ],
                  },
                ],
                namespace: 'test-namespace',
                parameter_format: 'POSITIONAL',
              },
              variable_values: {},
              flow_button_action_values: {
                '0': {
                  flow_token: '   ',
                },
              },
            },
          },
          buttons: [],
        },
      }

      const { request } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateNoHeader', type: INPUT.TEXT },
        },
      })

      const template = FlowWhatsappTemplate.fromHubtypeCMS(mockNode, 'en')

      expect(() =>
        // @ts-expect-error - accessing private method for testing
        template.getButtons(
          template.htWhatsappTemplate,
          template.buttons || [],
          {},
          template.flowButtonActionValues || {},
          request
        )
      ).toThrow(
        "WhatsApp template 'empty_flow_token' FLOW button at index 0 requires a non-empty flow_token"
      )
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
          by_locale: {
            en: {
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
              url_variable_values: {},
            },
          },
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
        },
      }

      const { request } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: whatsappTemplateFlow },
        requestArgs: {
          input: { data: 'templateNoHeader', type: INPUT.TEXT },
        },
      })

      const template = FlowWhatsappTemplate.fromHubtypeCMS(mockNode, 'en')
      // @ts-expect-error - accessing private method for testing
      const buttons = template.getButtons(
        template.htWhatsappTemplate,
        template.buttons!,
        template.urlVariableValues || {},
        template.flowButtonActionValues || {},
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
      const rendered = template.toBotonic(request)

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
      const rendered = template.toBotonic(request)

      // For WhatsApp, it should render a WhatsappTemplate component
      expect(rendered.type.name || rendered.type).toBe('WhatsappTemplate')
      expect(rendered.props.name).toBe('order_confirmation')
      expect(rendered.props.language).toBe('en')
    })
  })
})
