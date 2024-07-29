import { INPUT, PROVIDER } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowWhatsappCtaUrlButtonNode } from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check the contents of a WhatsApp URL CTA Button node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('The contents displayed have text in all fields', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'flowURLButton', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
      },
    })

    const firstContent = contents[0] as FlowWhatsappCtaUrlButtonNode

    expect(firstContent.header).toBe('Header text')
    expect(firstContent.text).toBe('WhatsApp URL CTA button')
    expect(firstContent.footer).toBe('footer text')
    expect(firstContent.displayText).toBe('Button text')
    expect(firstContent.url).toBe('https://www.hubtype.com')
  })
})
