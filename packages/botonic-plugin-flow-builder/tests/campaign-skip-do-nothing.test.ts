import { INPUT } from '@botonic/core'
import { beforeEach, describe, expect, test } from '@jest/globals'
import { PUSH_FLOW_PAYLOAD, SEPARATOR } from '../src/constants'
import { FlowDoNothing } from '../src/content-fields/flow-do-nothing'
import { FlowText } from '../src/content-fields/flow-text'
import type { HtDoNothingNode } from '../src/content-fields/hubtype-fields'
import { CampaignsV2Api } from '../src/services/campaigns-v2-api'
import { ProcessEnvNodeEnvs } from '../src/types'
import {
  mockSkipEmptyBotResponse,
  mockSmartIntent,
} from './__mocks__'
import {
  CAMPAIGN_DO_NOTHING_ID,
  CAMPAIGN_TEXT_THEN_SILENT_ID,
  campaignsDoNothingPushFlow,
} from './helpers/flows/campaigns-do-nothing-push-flow'
import { doNothingFlow } from './helpers/flows/do-nothing'
import { createTestPushFlowContext } from './helpers/push-flow-context'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
  getActionRequest,
} from './helpers/utils'

jest.mock('../src/services/campaigns-v2-api', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./__mocks__/campaigns-v2-api').getCampaignsV2ApiJestMock()
)

const CampaignsV2ApiMock = CampaignsV2Api as jest.MockedClass<
  typeof CampaignsV2Api
>

describe('Campaign skip on do-nothing', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockSmartIntent('Other')
    mockSkipEmptyBotResponse.mockClear()
    CampaignsV2ApiMock.mockClear()
  })

  describe('CampaignExecution.isActive', () => {
    test('returns true when payload is push-flow and context is push_flow', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsDoNothingPushFlow,
      })
      const request = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${CAMPAIGN_DO_NOTHING_ID}`,
          context: createTestPushFlowContext(CAMPAIGN_DO_NOTHING_ID, {
            campaign_flow_id: CAMPAIGN_DO_NOTHING_ID,
          }),
        },
        plugins: { flowBuilderPlugin },
      })

      await flowBuilderPlugin.pre(request)

      expect(flowBuilderPlugin.cmsApi.campaignExecution.isActive()).toBe(true)
    })

    test('returns false when push-flow payload has no push_flow context', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsDoNothingPushFlow,
      })
      const request = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${CAMPAIGN_DO_NOTHING_ID}`,
        },
        plugins: { flowBuilderPlugin },
      })

      await flowBuilderPlugin.pre(request)

      expect(flowBuilderPlugin.cmsApi.campaignExecution.isActive()).toBe(false)
    })

    test('returns false for non push-flow payloads even with push_flow context', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsDoNothingPushFlow,
      })
      const request = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: 'some-other-payload',
          context: createTestPushFlowContext(CAMPAIGN_DO_NOTHING_ID),
        },
        plugins: { flowBuilderPlugin },
      })

      await flowBuilderPlugin.pre(request)

      expect(flowBuilderPlugin.cmsApi.campaignExecution.isActive()).toBe(false)
    })
  })

  describe('FlowDoNothing.processContent', () => {
    test('calls skip API during campaign execution without prior bot response', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsDoNothingPushFlow,
      })
      const request = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${CAMPAIGN_DO_NOTHING_ID}`,
          context: createTestPushFlowContext(CAMPAIGN_DO_NOTHING_ID, {
            campaign_flow_id: CAMPAIGN_DO_NOTHING_ID,
          }),
        },
        plugins: { flowBuilderPlugin },
      })
      await flowBuilderPlugin.pre(request)
      const botContext = getActionRequest(request)

      const doNothing = FlowDoNothing.fromHubtypeCMS(
        campaignsDoNothingPushFlow.nodes.find(
          node => node.id === 'campaign-silent-start-node'
        ) as unknown as HtDoNothingNode
      )

      await doNothing.processContent(botContext)

      expect(mockSkipEmptyBotResponse).toHaveBeenCalledWith(
        CAMPAIGN_DO_NOTHING_ID
      )
      expect(CampaignsV2ApiMock).toHaveBeenCalledWith(botContext)
    })

    test('does not call skip API outside campaign execution', async () => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: doNothingFlow },
        requestArgs: {
          input: { data: 'silentBranch', type: INPUT.TEXT },
        },
      })

      expect(contents[0]).toBeInstanceOf(FlowDoNothing)
      expect(mockSkipEmptyBotResponse).not.toHaveBeenCalled()
    })

    test('does not call skip when campaign bot response was already registered', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsDoNothingPushFlow,
      })
      const request = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${CAMPAIGN_DO_NOTHING_ID}`,
          context: createTestPushFlowContext(CAMPAIGN_DO_NOTHING_ID, {
            campaign_flow_id: CAMPAIGN_DO_NOTHING_ID,
          }),
        },
        plugins: { flowBuilderPlugin },
      })
      await flowBuilderPlugin.pre(request)
      flowBuilderPlugin.cmsApi.campaignExecution.updateHasBotResponse({
        id: 'prior-bot-response-content',
        producesBotResponse: () => true,
      } as FlowText)
      const botContext = getActionRequest(request)

      const doNothing = FlowDoNothing.fromHubtypeCMS(
        campaignsDoNothingPushFlow.nodes.find(
          node => node.id === 'campaign-silent-start-node'
        ) as unknown as HtDoNothingNode
      )

      await doNothing.processContent(botContext)

      expect(mockSkipEmptyBotResponse).not.toHaveBeenCalled()
    })
  })

  describe('botonicInit with push-flow', () => {
    test('calls skip when campaign resolves only to do-nothing', async () => {
      const { request } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: campaignsDoNothingPushFlow },
        requestArgs: {
          isFirstInteraction: true,
          input: {
            type: INPUT.POSTBACK,
            payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${CAMPAIGN_DO_NOTHING_ID}`,
            context: createTestPushFlowContext(CAMPAIGN_DO_NOTHING_ID, {
              campaign_flow_id: CAMPAIGN_DO_NOTHING_ID,
            }),
          },
        },
      })

      expect(mockSkipEmptyBotResponse).toHaveBeenCalledWith(
        CAMPAIGN_DO_NOTHING_ID
      )
      expect(CampaignsV2ApiMock).toHaveBeenCalledWith(getActionRequest(request))
    })

    test('does not call skip when text precedes do-nothing in the same campaign turn', async () => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: campaignsDoNothingPushFlow },
        requestArgs: {
          isFirstInteraction: true,
          input: {
            type: INPUT.POSTBACK,
            payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${CAMPAIGN_TEXT_THEN_SILENT_ID}`,
            context: createTestPushFlowContext(CAMPAIGN_TEXT_THEN_SILENT_ID, {
              campaign_flow_id: CAMPAIGN_TEXT_THEN_SILENT_ID,
            }),
          },
        },
      })

      expect(contents).toHaveLength(2)
      expect(contents[0]).toBeInstanceOf(FlowText)
      expect(contents[1]).toBeInstanceOf(FlowDoNothing)
      expect(mockSkipEmptyBotResponse).not.toHaveBeenCalled()
    })
  })
})
