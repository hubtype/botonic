import type { BotContext } from '@botonic/core'
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import axios from 'axios'

import { HUBTYPE_API_URL } from '../../src/constants'
import { CampaignsClient } from '../../src/services/campaigns-client'

jest.mock('axios')
const axiosPostMock = axios.post as jest.MockedFunction<typeof axios.post>

class BotonicPluginFlowBuilder {
  getAccessToken = jest.fn(() => 'test-access-token')
}

function createBotContext(
  overrides: { hubtypeApi?: string; botId?: string; userId?: string } = {}
): BotContext {
  return {
    session: {
      bot: { id: overrides.botId ?? 'bid1' },
      user: { id: overrides.userId ?? 'uid1' },
    } as BotContext['session'],
    settings: (
      overrides.hubtypeApi !== undefined
        ? { HUBTYPE_API_URL: overrides.hubtypeApi }
        : {}
    ) as BotContext['settings'],
    plugins: {
      flowBuilder: new BotonicPluginFlowBuilder(),
    } as BotContext['plugins'],
  } as BotContext
}

describe('CampaignsClient', () => {
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

    const client = new CampaignsClient(
      createBotContext({ hubtypeApi, botId: 'bid1', userId: 'uid1' })
    )
    const result = await client.skipEmptyBotResponse(campaignId)

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

    const client = new CampaignsClient(createBotContext())
    await client.skipEmptyBotResponse('campaign-id')

    expect(axiosPostMock).toHaveBeenCalledWith(
      `${HUBTYPE_API_URL}/external/v2/conversational_apps/bid1/users/uid1/skip_campaign/`,
      { campaign_id: 'campaign-id' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-access-token',
        },
      }
    )
  })

  test('propagates axios rejection (e.g. 404 when chat does not belong to bot)', async () => {
    const notFoundError = Object.assign(new Error('Request failed'), {
      response: { status: 404 },
    })
    axiosPostMock.mockRejectedValue(notFoundError)

    const client = new CampaignsClient(
      createBotContext({ hubtypeApi: 'https://api.test.hubtype.com' })
    )

    await expect(client.skipEmptyBotResponse('campaign-id')).rejects.toBe(
      notFoundError
    )
  })
})
