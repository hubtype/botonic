import { jest } from '@jest/globals'

import type { SkipEmptyBotResponseResult } from '../../src/services/campaigns-client'

export const mockSkipEmptyBotResponse = jest.fn<
  (campaignId: string) => Promise<SkipEmptyBotResponseResult>
>(async () => ({
  id: 'exec-id',
  status: 'skipped',
  skip_reason: 'empty_bot_response',
}))

export function getCampaignsClientJestMock() {
  return {
    CampaignsClient: jest.fn().mockImplementation(() => ({
      skipEmptyBotResponse: mockSkipEmptyBotResponse,
    })),
  }
}
