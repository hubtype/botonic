import { INPUT, PROVIDER } from '@botonic/core'
import { createTestPluginPreRequest } from '@botonic/core/testing'
import { describe, expect, jest, test } from '@jest/globals'

import type { FlowBuilderContext } from '../src/action/context'
import {
  PushFlowError,
  PushFlowErrorCode,
  PushFlowResolver,
} from '../src/action/push-flow-resolver'
import { PUSH_FLOW_PAYLOAD, SEPARATOR } from '../src/constants'
import type { FlowContent } from '../src/content-fields'
import type { HtNodeWithContent } from '../src/content-fields/hubtype-fields'
import {
  asFlowBuilderApi,
  createMockFlowBuilderApi,
} from './helpers/mock-cms-api'

const CAMPAIGN_ID = '0197a2b1-0000-7000-8000-000000000001'
const PUSH_FLOW_CAMPAIGN_NODE_ID = 'campaign-uuid-1'

function createPushFlowContext({
  payload,
  campaignId = CAMPAIGN_ID,
  omitCampaignId = false,
}: {
  payload?: string
  campaignId?: string
  omitCampaignId?: boolean
}): {
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
      payload,
      context: omitCampaignId ? undefined : { campaign_id: campaignId },
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
    const payload = `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${PUSH_FLOW_CAMPAIGN_NODE_ID}`
    const { context, pushFlowNode } = createPushFlowContext({ payload })
    const contents: FlowContent[] = [{ id: 'content-1' } as FlowContent]
    jest
      .mocked(context.flowBuilderPlugin.getContentsByNode)
      .mockResolvedValue(contents)

    const result = await new PushFlowResolver(context).getContents()

    expect(result).toEqual({
      contents,
      campaignFirstMessageId: CAMPAIGN_ID,
    })
    expect(context.cmsApi.getNodeByCampaignId).toHaveBeenCalledWith(
      PUSH_FLOW_CAMPAIGN_NODE_ID
    )
    expect(context.flowBuilderPlugin.getContentsByNode).toHaveBeenCalledWith(
      pushFlowNode
    )
  })

  test('throws NoInputPayload when input payload is missing', async () => {
    const { context } = createPushFlowContext({ payload: undefined })

    await expect(new PushFlowResolver(context).getContents()).rejects.toThrow(
      PushFlowError
    )
    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoInputPayload,
    })
  })

  test('throws NoPushFlowId when payload has no campaign node id after separator', async () => {
    const { context } = createPushFlowContext({
      payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}`,
    })

    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoPushFlowId,
    })
  })

  test('throws NoPushFlowId when payload is only push-flow prefix', async () => {
    const { context } = createPushFlowContext({ payload: PUSH_FLOW_PAYLOAD })

    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoPushFlowId,
    })
  })

  test('throws NoPushFlowNode when campaign node id is not in the flow', async () => {
    const { context } = createPushFlowContext({
      payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}unknown-campaign-node`,
    })

    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignStartNode,
    })
  })

  test('throws NoCampaignId when input context has no campaign_id', async () => {
    const { context } = createPushFlowContext({
      payload: `${PUSH_FLOW_PAYLOAD}${SEPARATOR}${PUSH_FLOW_CAMPAIGN_NODE_ID}`,
      omitCampaignId: true,
    })

    await expect(
      new PushFlowResolver(context).getContents()
    ).rejects.toMatchObject({
      code: PushFlowErrorCode.NoCampaignId,
    })
  })
})
