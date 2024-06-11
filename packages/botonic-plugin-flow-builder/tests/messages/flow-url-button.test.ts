import { INPUT, PROVIDER } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowWhatsappCtaUrlButtonNode } from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { basicFlow } from '../helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from '../helpers/utils'

describe('Check the contents of a WhatsApp URL CTA Button node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })

  test('The contents displayed have text in all fields', async () => {
    const request = createRequest({
      input: { data: 'flowURLButton', type: INPUT.TEXT },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
      provider: PROVIDER.WHATSAPP,
    })

    const { contents } = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )
    const firstContent = contents[0] as FlowWhatsappCtaUrlButtonNode

    expect(firstContent.header).toBe('Header text')
    expect(firstContent.text).toBe('WhatsApp URL CTA button')
    expect(firstContent.footer).toBe('footer text')
    expect(firstContent.displayText).toBe('Button text')
    expect(firstContent.url).toBe('https://www.hubtype.com')
  })
})
