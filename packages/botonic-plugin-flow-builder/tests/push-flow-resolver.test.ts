import { BotonicInputContextType, INPUT, PROVIDER } from '@botonic/core'
import { createTestPluginPreRequest } from '@botonic/core/testing'
import { describe, expect, jest, test } from '@jest/globals'

import type { FlowBuilderContext } from '../src/action/context'
import {
  PushFlowError,
  PushFlowErrorCode,
  PushFlowResolver,
} from '../src/action/push-flow-resolver'
import type { FlowContent } from '../src/content-fields'
import type { HtNodeWithContent } from '../src/content-fields/hubtype-fields'
import {
  asFlowBuilderApi,
  createMockFlowBuilderApi,
} from './helpers/mock-cms-api'
import { createTestPushFlowContext } from './helpers/push-flow-context'

const CAMPAIGN_ID = '0197a2b1-0000-7000-8000-000000000001'
const PUSH_FLOW_CAMPAIGN_NODE_ID = 'campaign-uuid-1'

function createPushFlowContext({
  campaignId = CAMPAIGN_ID,
  campaignFlowId = PUSH_FLOW_CAMPAIGN_NODE_ID,
  inputContext,
}: {
  campaignId?: string
  campaignFlowId?: string
  inputContext?: ReturnType<typeof createTestPushFlowContext> | null
} = {}): {
  context: FlowBuilderContext
  pushFlowNode: HtNodeWithContent
} {
  const pushFlowNode = { id: 'campaign-node' } as HtNodeWithContent
  const mockContents: FlowContent[] = []

  const cmsApiMock = createMockFlowBuilderApi({
    getNodeByCampaignId: jest.fn((id: unknown) => {
      if (id === PUSH_FLOW_CAMPAIGN_NODE_ID) {
        return pushFlowNode
      }
      return undefined
    }),
  })

  const getContentsByNode = jest
    .fn<() => Promise<FlowContent[]>>()
    .mockResolvedValue(mockContents)

  const flowBuilderPlugin = { getContentsByNode }

  const request = createTestPluginPreRequest({
    session: {
      isFirstInteraction: false,
      organization: 'orgTest',
      organizationId: 'orgIdTest',
      botId: 'bid1',
      user: {
        id: 'uid1',
        provider: PROVIDER.WEBCHAT,
        locale: 'en',
        country: 'US',
        systemLocale: 'en',
      },
    },
    input: {
      bot_interaction_id: 'testInteractionId',
      message_id: 'testMessageId',
      is_new_conversation: false,
      type: INPUT.POSTBACK,
      context:
        inputContext === null
          ? undefined
          : (inputContext ??
            createTestPushFlowContext(campaignId, {
              campaign_flow_id: campaignFlowId,
            })),
    },
    plugins: {},
  })

  const context: FlowBuilderContext = {
    cmsApi: asFlowBuilderApi(cmsApiMock),
    flowBuilderPlugin:
      flowBuilderPlugin as unknown as FlowBuilderContext['flowBuilderPlugin'],
    request,
    resolvedLocale: 'en',
  }

  return { context, pushFlowNode }
}

describe('PushFlowResolver', () => {
  test('getContents resolves node and returns campaign first message id', async () => {
    const { context, pushFlowNode } = createPushFlowContext()
    const contents: FlowContent[] = [{ id: 'content-1' } as FlowContent]
    jest
      .mocked(context.flowBuilderPlugin.getContentsByNode)
      .mockResolvedValue(contents)

    const result = await new PushFlowResolver(context).getContents()

    expect(result).toEqual({ contents })
    expect(context.cmsApi.getNodeByCampaignId).toHaveBeenCalledWith(
      PUSH_FLOW_CAMPAIGN_NODE_ID
    )
    expect(context.flowBuilderPlugin.getContentsByNode).toHaveBeenCalledWith(
      pushFlowNode
    )
  })

  test('throws NoCampaignStartNode when campaign_flow_id is not in the flow', async () => {
    const { context } = createPushFlowContext({
      campaignFlowId: 'unknown-campaign-node',
    })

    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignStartNode,
    })
  })

  test('throws NoCampaignContext when input has no push-flow context', async () => {
    const { context } = createPushFlowContext({ inputContext: null })

    await expect(new PushFlowResolver(context).getContents()).rejects.toThrow(
      PushFlowError
    )
    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignContext,
    })
  })

  test('throws NoCampaignContext when context is active_campaigns', async () => {
    const { context } = createPushFlowContext()
    context.request.input.context = {
      type: BotonicInputContextType.ActiveCampaigns,
      campaigns_v2: [],
    }

    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignContext,
    })
  })

  test('throws NoCampaignFollowUpNode when follow up id does not match a node', async () => {
    const { context } = createPushFlowContext({
      inputContext: createTestPushFlowContext(CAMPAIGN_ID, {
        campaign_flow_id: PUSH_FLOW_CAMPAIGN_NODE_ID,
        campaign_follow_up_id: 'missing-follow-up',
      }),
    })
    jest
      .mocked(context.cmsApi.getNodeById)
      .mockReturnValue(undefined as unknown as HtNodeWithContent)

    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignFollowUpNode,
    })
  })
})
