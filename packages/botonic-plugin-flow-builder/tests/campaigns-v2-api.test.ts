import type { BotContext } from '@botonic/core'
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import axios from 'axios'

import { FLOW_BUILDER_API_URL_PROD } from '../src/constants'
import { CampaignsV2Api } from '../src/services/campaigns-v2-api'

jest.mock('axios')
const axiosPostMock = axios.post as jest.MockedFunction<typeof axios.post>

class BotonicPluginFlowBuilder {
  getAccessToken = jest.fn(() => 'test-access-token')
}

function createBotContext(
  overrides: {
    hubtypeApi?: string
    botId?: string
    userId?: string
  } = {}
): BotContext {
  const hubtypeApi = overrides.hubtypeApi
  return {
    session: {
      bot: { id: overrides.botId ?? 'bid1' },
      user: { id: overrides.userId ?? 'uid1' },
      ...(hubtypeApi !== undefined ? { _hubtype_api: hubtypeApi } : {}),
    } as BotContext['session'],
    plugins: {
      flowBuilder: new BotonicPluginFlowBuilder(),
    } as BotContext['plugins'],
  } as BotContext
}

describe('CampaignsV2Api', () => {
  beforeEach(() => {
    axiosPostMock.mockReset()
  })

  test('posts to skip_campaign with campaign_id in body and bearer token', async () => {
    const campaignId = '00000000-0000-7000-8000-000000000001'
    const hubtypeApi = 'https://api.test.hubtype.com'
    const responseBody = {
      id: '00000000-0000-7000-8000-000000000002',
      status: 'skipped' as const,
      skip_reason: 'empty_bot_response' as const,
    }
    axiosPostMock.mockResolvedValue({ data: responseBody })

    const api = new CampaignsV2Api(
      createBotContext({ hubtypeApi, botId: 'bid1', userId: 'uid1' })
    )
    const result = await api.skipEmptyBotResponse(campaignId)

    expect(axiosPostMock).toHaveBeenCalledWith(
      `${hubtypeApi}/external/v2/conversational_apps/bid1/users/uid1/skip_campaign/`,
      { campaign_id: campaignId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-access-token',
        },
      }
    )
    expect(result).toEqual(responseBody)
  })

  test('uses FLOW_BUILDER_API_URL_PROD when session has no _hubtype_api', async () => {
    axiosPostMock.mockResolvedValue({
      data: {
        id: 'exec-id',
        status: 'skipped',
        skip_reason: 'empty_bot_response',
      },
    })

    const api = new CampaignsV2Api(createBotContext())
    await api.skipEmptyBotResponse('campaign-id')

    expect(axiosPostMock).toHaveBeenCalledWith(
      `${FLOW_BUILDER_API_URL_PROD}/external/v2/conversational_apps/bid1/users/uid1/skip_campaign/`,
      { campaign_id: 'campaign-id' },
      expect.any(Object)
    )
  })

  test('propagates axios rejection (e.g. 404 when chat does not belong to bot)', async () => {
    const notFoundError = Object.assign(new Error('Request failed'), {
      response: { status: 404 },
    })
    axiosPostMock.mockRejectedValue(notFoundError)

    const api = new CampaignsV2Api(
      createBotContext({ hubtypeApi: 'https://api.test.hubtype.com' })
    )

    await expect(api.skipEmptyBotResponse('campaign-id')).rejects.toBe(
      notFoundError
    )
  })
})
