import { INPUT, PROVIDER } from '@botonic/core'
import { beforeEach, describe, expect, test } from '@jest/globals'

import { PushFlowErrorCode } from '../src/action/push-flow-resolver'
import { PUSH_FLOW_PAYLOAD } from '../src/constants'
import { FlowWhatsappTemplate } from '../src/content-fields/flow-whatsapp-template'
import { FlowText } from '../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { basicFlow } from './helpers/flows/basic'
import { campaignsFlow } from './helpers/flows/campaigns'
import { campaignsWhatsappTemplatePushFlow } from './helpers/flows/campaigns-whatsapp-template-push-flow'
import { createTestPushFlowContext } from './helpers/push-flow-context'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
  renderFlowBuilderActionHtml,
} from './helpers/utils'

const CAMPAIGN_V2_ID = '0197a2b1-0000-7000-8000-000000000001'

function getBotResponseMessageOpenTags(html: string): string[] {
  const tags = html.match(/<message\b[^>]*>/g) ?? []
  return tags.filter(tag => !tag.includes('type="webchatsettings"'))
}

describe('Check the contents returned by the plugin when user clicks a button', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))
  test('When button exist in flow the following contents are displayed', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          payload: 'eb877738-3cf4-4a57-9f46-3122e18f1cc7',
          type: INPUT.POSTBACK,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('Message after button text 1')
    expect(contents.length).toBe(2)
  })

  test('When button no exist in flow the fallback contents are displayed', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          payload: 'fake-id-that-does-not-exist',
          type: INPUT.POSTBACK,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1st message')
    expect(contents.length).toBe(1)
  })
})

describe('PUSH_FLOW_PAYLOAD - Campaign flow trigger via payload', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))

  test('Should return campaign start node content when PUSH_FLOW_PAYLOAD is used with valid campaign ID', async () => {
    const campaignFlowId = 'campaign-uuid-1'

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        input: {
          payload: PUSH_FLOW_PAYLOAD,
          type: INPUT.POSTBACK,
          context: createTestPushFlowContext(CAMPAIGN_V2_ID, {
            campaign_flow_id: campaignFlowId,
          }),
        },
      },
    })

    expect(contents.length).toBe(2)
    expect((contents[0] as FlowText).text).toBe(
      'Welcome to Campaign 1 - Summer Sale!'
    )
    expect((contents[1] as FlowText).text).toBe('Get 50% off all items!')
  })

  test('Should return campaign 2 content when using campaign-uuid-2', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        input: {
          payload: PUSH_FLOW_PAYLOAD,
          type: INPUT.POSTBACK,
          context: createTestPushFlowContext(CAMPAIGN_V2_ID, {
            campaign_flow_id: 'campaign-uuid-2',
          }),
        },
      },
    })

    expect(contents.length).toBe(1)
    expect((contents[0] as FlowText).text).toBe(
      'Welcome to Campaign 2 - New Product Launch!'
    )
  })

  test('throws when campaign_flow_id does not match a campaign', async () => {
    await expect(
      createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: campaignsFlow },
        requestArgs: {
          input: {
            payload: PUSH_FLOW_PAYLOAD,
            type: INPUT.POSTBACK,
            context: createTestPushFlowContext(CAMPAIGN_V2_ID, {
              campaign_flow_id: 'non-existent-campaign-id',
            }),
          },
        },
      })
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignStartNode,
    })
  })

  test('throws when PUSH_FLOW_PAYLOAD is used without push-flow context', async () => {
    await expect(
      createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: campaignsFlow },
        requestArgs: {
          input: {
            payload: PUSH_FLOW_PAYLOAD,
            type: INPUT.POSTBACK,
          },
        },
      })
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignContext,
    })
  })
})

describe('PUSH_FLOW_PAYLOAD - skip first interaction in pre()', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))

  test('pre() sets is_first_interaction to false when payload is push-flow', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: campaignsFlow })
    const request = createRequest({
      isFirstInteraction: true,
      input: { type: INPUT.POSTBACK, payload: PUSH_FLOW_PAYLOAD },
      plugins: { flowBuilderPlugin },
    })

    expect(request.session.is_first_interaction).toBe(true)

    await flowBuilderPlugin.pre(request)

    expect(request.session.is_first_interaction).toBe(false)
  })

  test('pre() does not change is_first_interaction for other payloads', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: campaignsFlow })
    const request = createRequest({
      isFirstInteraction: true,
      input: { type: INPUT.POSTBACK, payload: 'unrelated-payload' },
      plugins: { flowBuilderPlugin },
    })

    await flowBuilderPlugin.pre(request)

    expect(request.session.is_first_interaction).toBe(true)
  })

  test('first interaction with push-flow returns only campaign contents (no main welcome)', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        isFirstInteraction: true,
        input: {
          type: INPUT.POSTBACK,
          payload: PUSH_FLOW_PAYLOAD,
          context: createTestPushFlowContext(CAMPAIGN_V2_ID, {
            campaign_flow_id: 'campaign-uuid-1',
          }),
        },
      },
    })

    expect(contents.length).toBe(2)
    expect((contents[0] as FlowText).text).toBe(
      'Welcome to Campaign 1 - Summer Sale!'
    )
    expect(
      contents.every(content => !(content instanceof FlowWhatsappTemplate))
    )
    expect(
      contents.some(
        content =>
          content instanceof FlowText && content.text === 'Welcome to main flow'
      )
    ).toBe(false)
  })

  test('first interaction with push-flow to WhatsApp template campaign returns template only', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsWhatsappTemplatePushFlow },
      requestArgs: {
        isFirstInteraction: true,
        input: {
          type: INPUT.POSTBACK,
          payload: PUSH_FLOW_PAYLOAD,
          context: createTestPushFlowContext(CAMPAIGN_V2_ID, {
            campaign_flow_id: 'campaign-uuid-template',
          }),
        },
      },
    })

    expect(contents).toHaveLength(1)
    expect(contents[0]).toBeInstanceOf(FlowWhatsappTemplate)
    const template = contents[0] as FlowWhatsappTemplate
    expect(template.htWhatsappTemplate.name).toBe('proactive_campaign_template')
    expect(
      contents.some(
        content =>
          content instanceof FlowText && content.text === 'Welcome to main flow'
      )
    ).toBe(false)
  })

  test('first interaction without push-flow still returns main welcome before anything else', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsWhatsappTemplatePushFlow },
      requestArgs: {
        isFirstInteraction: true,
        input: { type: INPUT.TEXT, data: 'hello' },
      },
    })

    expect(contents.length).toBeGreaterThanOrEqual(1)
    expect(contents[0]).not.toBeInstanceOf(FlowWhatsappTemplate)
    expect((contents[0] as FlowText).text).toBe('Welcome to main flow')
  })
})

describe('PUSH_FLOW_PAYLOAD - campaign first message HTML attributes', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))

  test('marks only the first message when push-flow resolves with two texts', async () => {
    const html = await renderFlowBuilderActionHtml({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        input: {
          payload: PUSH_FLOW_PAYLOAD,
          type: INPUT.POSTBACK,
          context: createTestPushFlowContext(CAMPAIGN_V2_ID, {
            campaign_flow_id: 'campaign-uuid-1',
          }),
        },
      },
    })

    const messageTags = getBotResponseMessageOpenTags(html)
    expect(messageTags).toHaveLength(2)
    expect(messageTags[0]).toContain('iscampaignfirstmessage="1"')
    expect(messageTags[0]).toContain(`campaignid="${CAMPAIGN_V2_ID}"`)
    expect(messageTags[1]).not.toContain('iscampaignfirstmessage')
    expect(messageTags[1]).not.toContain('campaignid')
  })

  test('marks the WhatsApp template message when push-flow resolves to a template node', async () => {
    const html = await renderFlowBuilderActionHtml({
      flowBuilderOptions: { flow: campaignsWhatsappTemplatePushFlow },
      requestArgs: {
        provider: PROVIDER.WHATSAPP,
        input: {
          payload: PUSH_FLOW_PAYLOAD,
          type: INPUT.POSTBACK,
          context: createTestPushFlowContext(CAMPAIGN_V2_ID, {
            campaign_flow_id: 'campaign-uuid-template',
          }),
        },
      },
    })

    const messageTags = getBotResponseMessageOpenTags(html)
    expect(messageTags).toHaveLength(1)
    expect(messageTags[0]).toContain('iscampaignfirstmessage="1"')
    expect(messageTags[0]).toContain(`campaignid="${CAMPAIGN_V2_ID}"`)
    expect(messageTags[0]).toContain('name="proactive_campaign_template"')
  })

  test('throws when push-flow campaign node cannot be resolved', async () => {
    await expect(
      renderFlowBuilderActionHtml({
        flowBuilderOptions: { flow: campaignsFlow },
        requestArgs: {
          input: {
            payload: PUSH_FLOW_PAYLOAD,
            type: INPUT.POSTBACK,
            context: createTestPushFlowContext(CAMPAIGN_V2_ID, {
              campaign_flow_id: 'non-existent-campaign-id',
            }),
          },
        },
      })
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignStartNode,
    })
  })
})
