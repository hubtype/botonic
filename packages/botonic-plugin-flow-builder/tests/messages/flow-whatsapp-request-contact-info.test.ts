import { INPUT, PROVIDER } from '@botonic/core'
import { describe, expect, test } from '@jest/globals'
import TestRenderer from 'react-test-renderer'

import type { FlowWhatsappRequestContactInfoNode } from '../../src/content-fields/flow-whatsapp-request-contact-info'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { whatsappRequestContactInfoFlow } from '../helpers/flows/whatsapp-request-contact-info'
import {
  createFlowBuilderPluginAndGetContents,
  createRequest,
} from '../helpers/utils'

const renderToJSON = (sut: JSX.Element) => TestRenderer.create(sut).toJSON()

describe('Check the contents of a whatsapp request contact info node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('parses the node content from CMS', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappRequestContactInfoFlow },
      requestArgs: {
        input: { data: 'requestContactInfo', type: INPUT.TEXT },
      },
    })

    const requestContactInfoContent =
      contents[0] as FlowWhatsappRequestContactInfoNode

    expect(requestContactInfoContent.text).toBe(
      'Please share your phone number'
    )
  })

  test('renders WhatsappRequestContactInfo on WhatsApp', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappRequestContactInfoFlow },
      requestArgs: {
        input: { data: 'requestContactInfo', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
      },
    })

    const requestContactInfoContent =
      contents[0] as FlowWhatsappRequestContactInfoNode
    const rendered = renderToJSON(requestContactInfoContent.toBotonic(request))

    expect(rendered).toMatchInlineSnapshot(`
<message
  body="Please share your phone number"
  type="whatsapp-request-contact-info"
/>
`)
  })

  test('renders text fallback on webchat', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappRequestContactInfoFlow },
      requestArgs: {
        input: { data: 'requestContactInfo', type: INPUT.TEXT },
        provider: PROVIDER.WEBCHAT,
      },
    })

    const requestContactInfoContent =
      contents[0] as FlowWhatsappRequestContactInfoNode
    const rendered = requestContactInfoContent.toBotonic(request)

    expect(rendered.props.children).toBe('Please share your phone number')
  })
})
