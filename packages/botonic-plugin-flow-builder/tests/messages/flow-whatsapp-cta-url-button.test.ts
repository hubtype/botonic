import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import type { FlowWhatsappCtaUrlButtonNode } from '../../src/content-fields/flow-whatsapp-cta-url-button'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { whatsappCtaUrlFlow } from '../helpers/flows/whatsapp-cta-url'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check the contents of a whatsapp cta url button node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('The header and footer are undefined', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappCtaUrlFlow },
      requestArgs: {
        input: { data: 'ctaUrl', type: INPUT.TEXT },
      },
    })

    const whatsappCtaUrlContent = contents[0] as FlowWhatsappCtaUrlButtonNode

    expect(whatsappCtaUrlContent.headerType).toBe('text')
    expect(whatsappCtaUrlContent.header).toBe('')
    expect(whatsappCtaUrlContent.footer).toBe('')
    expect(whatsappCtaUrlContent.text).toBe('Main text for cta url message')
    expect(whatsappCtaUrlContent.url).toBe('https://www.hubtype.com')
    expect(whatsappCtaUrlContent.displayText).toBe('open')
  })

  test('The header is an image', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappCtaUrlFlow },
      requestArgs: {
        input: { data: 'imageCtaUrl', type: INPUT.TEXT },
      },
    })

    const whatsappCtaUrlContent = contents[0] as FlowWhatsappCtaUrlButtonNode

    expect(whatsappCtaUrlContent.headerType).toBe('image')
    expect(whatsappCtaUrlContent.headerImage).toBe(
      'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/dragon_ball_walpaper.jpg'
    )
    expect(whatsappCtaUrlContent.footer).toBe('Footer text for cta url message')
    expect(whatsappCtaUrlContent.text).toBe('Main text for cta url message')
    expect(whatsappCtaUrlContent.url).toBe('https://www.hubtype.com')
    expect(whatsappCtaUrlContent.displayText).toBe('open')
  })

  test('The header is a video', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappCtaUrlFlow },
      requestArgs: {
        input: { data: 'videoCtaUrl', type: INPUT.TEXT },
      },
    })

    const whatsappCtaUrlContent = contents[0] as FlowWhatsappCtaUrlButtonNode

    expect(whatsappCtaUrlContent.headerType).toBe('video')
    expect(whatsappCtaUrlContent.headerVideo).toBe(
      'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/video_test.mp4'
    )
    expect(whatsappCtaUrlContent.footer).toBe('Footer text for cta url message')
    expect(whatsappCtaUrlContent.text).toBe('Main text for cta url message')
    expect(whatsappCtaUrlContent.url).toBe('https://www.hubtype.com')
    expect(whatsappCtaUrlContent.displayText).toBe('open')
  })

  test('The header is a document', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappCtaUrlFlow },
      requestArgs: {
        input: { data: 'documentCtaUrl', type: INPUT.TEXT },
      },
    })

    const whatsappCtaUrlContent = contents[0] as FlowWhatsappCtaUrlButtonNode

    expect(whatsappCtaUrlContent.headerType).toBe('document')
    expect(whatsappCtaUrlContent.headerDocument).toBe(
      'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/requisitos_cta_url_whatsapp.pdf'
    )
    expect(whatsappCtaUrlContent.footer).toBe('Footer text for cta url message')
    expect(whatsappCtaUrlContent.text).toBe('Main text for cta url message')
    expect(whatsappCtaUrlContent.url).toBe('https://www.hubtype.com')
    expect(whatsappCtaUrlContent.displayText).toBe('open')
  })
})
