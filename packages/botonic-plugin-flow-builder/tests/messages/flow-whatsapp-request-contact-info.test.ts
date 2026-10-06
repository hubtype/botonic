import {
  INPUT,
  OutputMessageType,
  PROVIDER,
  type RequestContactInfoMessage,
  WhatsappInputOrigin,
} from '@botonic/core'
import TestRenderer from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

import { FlowWhatsappRequestContactInfoNode } from '../../src/content-fields/flow-whatsapp-request-contact-info'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { whatsappRequestContactInfoFlow } from '../helpers/flows/whatsapp-request-contact-info'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
} from '../helpers/utils'

const renderToJSON = (sut: JSX.Element) => TestRenderer.create(sut).toJSON()

const requestContactInfoNodeId = '019a0001-0001-7000-8000-000000000001'
const contactReceivedNodeId = '019a0001-0001-7000-8000-000000000003'

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

  test('stores whatsapp_request_contact when rendering a CMS node', async () => {
    const { request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: whatsappRequestContactInfoFlow },
      requestArgs: {
        input: { data: 'requestContactInfo', type: INPUT.TEXT },
        provider: PROVIDER.WHATSAPP,
      },
    })

    expect(request.session.whatsapp_request_contact?.id).toBe(
      requestContactInfoNodeId
    )
  })
})

describe('whatsapp request contact info origin resolution', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('resolves contact request payload from button target and clears origin', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({
      flow: whatsappRequestContactInfoFlow,
    })
    const request = createRequest({
      input: {
        type: INPUT.CONTACT,
        origin: WhatsappInputOrigin.ContactRequest,
      },
      whatsappRequestContactId: requestContactInfoNodeId,
      plugins: { flowBuilderPlugin },
    })

    await flowBuilderPlugin.pre(request)

    expect(request.input.payload).toBe(contactReceivedNodeId)
    expect(request.session.whatsapp_request_contact).toBeUndefined()
  })

  test('clears origin when contact request has no stored node', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({
      flow: whatsappRequestContactInfoFlow,
    })
    const request = createRequest({
      input: {
        type: INPUT.CONTACT,
        origin: WhatsappInputOrigin.ContactRequest,
      },
      plugins: { flowBuilderPlugin },
    })

    await flowBuilderPlugin.pre(request)

    expect(request.input.payload).toBeUndefined()
    expect(request.session.whatsapp_request_contact).toBeUndefined()
  })

  test('does not resolve payload when origin is not contact_request', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({
      flow: whatsappRequestContactInfoFlow,
    })
    const request = createRequest({
      input: {
        type: INPUT.CONTACT,
        origin: WhatsappInputOrigin.Other,
      },
      whatsappRequestContactId: requestContactInfoNodeId,
      plugins: { flowBuilderPlugin },
    })

    await flowBuilderPlugin.pre(request)

    expect(request.input.payload).toBeUndefined()
    expect(request.session.whatsapp_request_contact?.id).toBe(
      requestContactInfoNodeId
    )
  })
})

describe('FlowWhatsappRequestContactInfoNode.fromAIAgent', () => {
  const message: RequestContactInfoMessage = {
    type: OutputMessageType.RequestContactInfo,
    content: { text: 'Please share your phone number' },
  }

  test('renders WhatsappRequestContactInfo on WhatsApp', () => {
    const request = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
      provider: PROVIDER.WHATSAPP,
    })
    const rendered = renderToJSON(
      FlowWhatsappRequestContactInfoNode.fromAIAgent('id', message, request)
    )

    expect(rendered).toMatchInlineSnapshot(`
<message
  body="Please share your phone number"
  type="whatsapp-request-contact-info"
/>
`)
  })

  test('renders text fallback on webchat', () => {
    const request = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
      provider: PROVIDER.WEBCHAT,
    })
    const rendered = FlowWhatsappRequestContactInfoNode.fromAIAgent(
      'id',
      message,
      request
    )

    expect(rendered.props.children).toBe('Please share your phone number')
  })

  test('clears whatsapp_request_contact when rendered by AI agent', () => {
    const request = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
      provider: PROVIDER.WHATSAPP,
      whatsappRequestContactId: requestContactInfoNodeId,
    })

    FlowWhatsappRequestContactInfoNode.fromAIAgent('id', message, request)

    expect(request.session.whatsapp_request_contact).toBeUndefined()
  })
})
