import { jest } from '@jest/globals'

import type { SkipEmptyBotResponseResult } from '../../src/services/campaigns-v2-api'

export const mockSkipEmptyBotResponse = jest.fn<
  (campaignId: string) => Promise<SkipEmptyBotResponseResult>
>(async () => ({
  id: 'exec-id',
  status: 'skipped',
  skip_reason: 'empty_bot_response',
}))

export function getCampaignsV2ApiJestMock() {
  return {
    CampaignsV2Api: jest.fn().mockImplementation(() => ({
      skipEmptyBotResponse: mockSkipEmptyBotResponse,
    })),
  }
}
