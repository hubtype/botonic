import { INPUT, PROVIDER } from '@botonic/core'
import { describe, expect, test } from '@jest/globals'

import { FlowWhatsappTemplate } from '../src/content-fields/flow-whatsapp-template'
import { ProcessEnvNodeEnvs } from '../src/types'
import { whatsappTemplateFlow } from './helpers/flows/whatsapp-template'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('FlowFactory - WHATSAPP_TEMPLATE case', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('should return FlowWhatsappTemplate when keyword triggers whatsapp-template node with text header', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappTemplateFlow },
      requestArgs: {
        input: { data: 'templateTextHeader', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
      },
    })

    expect(contents.length).toBeGreaterThan(0)
    expect(contents[0]).toBeInstanceOf(FlowWhatsappTemplate)

    const whatsappTemplate = contents[0] as FlowWhatsappTemplate
    expect(whatsappTemplate.htWhatsappTemplate.name).toBe('order_confirmation')
    expect(whatsappTemplate.htWhatsappTemplate.language).toBe('en')
    expect(whatsappTemplate.htWhatsappTemplate.namespace).toBe('test-namespace')
  })

  test('should return FlowWhatsappTemplate when keyword triggers whatsapp-template node with image header', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappTemplateFlow },
      requestArgs: {
        input: { data: 'templateImageHeader', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
      },
    })

    expect(contents.length).toBeGreaterThan(0)
    expect(contents[0]).toBeInstanceOf(FlowWhatsappTemplate)

    const whatsappTemplate = contents[0] as FlowWhatsappTemplate
    expect(whatsappTemplate.htWhatsappTemplate.name).toBe('promotional_offer')
    expect(whatsappTemplate.htWhatsappTemplate.language).toBe('en')
  })

  test('should return FlowWhatsappTemplate when keyword triggers whatsapp-template node with buttons', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappTemplateFlow },
      requestArgs: {
        input: { data: 'templateButtons', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
      },
    })

    expect(contents.length).toBeGreaterThan(0)
    expect(contents[0]).toBeInstanceOf(FlowWhatsappTemplate)

    const whatsappTemplate = contents[0] as FlowWhatsappTemplate
    expect(whatsappTemplate.htWhatsappTemplate.name).toBe('support_options')
    expect(whatsappTemplate.htWhatsappTemplate.language).toBe('en')
  })

  test('should return FlowWhatsappTemplate when keyword triggers whatsapp-template node without header', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappTemplateFlow },
      requestArgs: {
        input: { data: 'templateNoHeader', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
      },
    })

    expect(contents.length).toBeGreaterThan(0)
    expect(contents[0]).toBeInstanceOf(FlowWhatsappTemplate)

    const whatsappTemplate = contents[0] as FlowWhatsappTemplate
    expect(whatsappTemplate.htWhatsappTemplate.name).toBe('simple_notification')
    expect(whatsappTemplate.htWhatsappTemplate.language).toBe('en')
  })

  test('should correctly instantiate FlowWhatsappTemplate with all properties from CMS', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappTemplateFlow },
      requestArgs: {
        input: { data: 'templateTextHeader', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
      },
    })

    const whatsappTemplate = contents[0] as FlowWhatsappTemplate

    // Verify the factory correctly passed all properties
    expect(whatsappTemplate.id).toBe('whatsapp-template-text-header-node')
    expect(whatsappTemplate.htWhatsappTemplate.name).toBe('order_confirmation')
    expect(whatsappTemplate.htWhatsappTemplate.language).toBe('en')
    expect(whatsappTemplate.htWhatsappTemplate.namespace).toBe('test-namespace')

    // Verify template components are available
    expect(whatsappTemplate.htWhatsappTemplate.components).toBeDefined()
    expect(whatsappTemplate.htWhatsappTemplate.components.length).toBeGreaterThan(0)
  })

  test('should handle FlowWhatsappTemplate with locale-specific content', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappTemplateFlow },
      requestArgs: {
        input: { data: 'templateImageHeader', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
        user: {
          locale: 'es',
          country: 'ES',
          systemLocale: 'es',
        },
      },
    })

    expect(contents.length).toBeGreaterThan(0)
    expect(contents[0]).toBeInstanceOf(FlowWhatsappTemplate)

    const whatsappTemplate = contents[0] as FlowWhatsappTemplate
    // The template uses locale-specific media
    expect(whatsappTemplate.headerVariables).toBeDefined()
  })

  test('should handle non-WhatsApp provider by returning FlowWhatsappTemplate', async () => {
    // FlowWhatsappTemplate should still be created, but toBotonic will render differently
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappTemplateFlow },
      requestArgs: {
        input: { data: 'templateTextHeader', type: INPUT.TEXT },
        provider: PROVIDER.WEBCHAT, // Non-WhatsApp provider
      },
    })

    expect(contents.length).toBeGreaterThan(0)
    expect(contents[0]).toBeInstanceOf(FlowWhatsappTemplate)
  })
})

