import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { PUSH_FLOW_PAYLOAD, SEPARATOR } from '../src/constants'
import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { basicFlow } from './helpers/flows/basic'
import { campaignsFlow } from './helpers/flows/campaigns'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

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
    const campaignId = 'campaign-uuid-1'
    const pushFlowPayload = `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${campaignId}`

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        input: {
          payload: pushFlowPayload,
          type: INPUT.POSTBACK,
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
    const campaignId = 'campaign-uuid-2'
    const pushFlowPayload = `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${campaignId}`

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        input: {
          payload: pushFlowPayload,
          type: INPUT.POSTBACK,
        },
      },
    })

    expect(contents.length).toBe(1)
    expect((contents[0] as FlowText).text).toBe(
      'Welcome to Campaign 2 - New Product Launch!'
    )
  })

  test('Should return fallback when PUSH_FLOW_PAYLOAD is used with invalid campaign ID', async () => {
    const invalidCampaignId = 'non-existent-campaign-id'
    const pushFlowPayload = `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${invalidCampaignId}`

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        input: {
          payload: pushFlowPayload,
          type: INPUT.POSTBACK,
        },
      },
    })

    // Should return fallback when campaign not found
    expect(contents.length).toBe(1)
    expect((contents[0] as FlowText).text).toBe(
      "Sorry, I didn't understand that."
    )
  })

  test('Should return fallback when PUSH_FLOW_PAYLOAD is used without campaign ID', async () => {
    const pushFlowPayload = `${PUSH_FLOW_PAYLOAD}${SEPARATOR}`

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        input: {
          payload: pushFlowPayload,
          type: INPUT.POSTBACK,
        },
      },
    })

    // Should return fallback when no campaign ID provided
    expect(contents.length).toBe(1)
    expect((contents[0] as FlowText).text).toBe(
      "Sorry, I didn't understand that."
    )
  })

  test('Should return fallback when PUSH_FLOW_PAYLOAD has no separator', async () => {
    const pushFlowPayload = PUSH_FLOW_PAYLOAD

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: campaignsFlow },
      requestArgs: {
        input: {
          payload: pushFlowPayload,
          type: INPUT.POSTBACK,
        },
      },
    })

    // Should return fallback when no separator in payload
    expect(contents.length).toBe(1)
    expect((contents[0] as FlowText).text).toBe(
      "Sorry, I didn't understand that."
    )
  })
})
