import { jest } from '@jest/globals'

import {
  type AvailabilityData,
  HubtypeQueuesClient,
} from '../../src/services/hubtype-queues-client'

interface QueueAvailabilityMockOptions {
  availableAgents?: number
  isOpen?: boolean
  name: string
}

export function mockQueueAvailability({
  availableAgents = 0,
  isOpen = false,
  name,
}: QueueAvailabilityMockOptions) {
  const getQueueAvailabilitySpy = jest.spyOn(
    HubtypeQueuesClient.prototype as any,
    'getAvailability'
  )

  getQueueAvailabilitySpy.mockImplementation(
    async (): Promise<AvailabilityData> => {
      return {
        available: true,
        waiting_cases: 0,
        availability_threshold_waiting_cases: 0,
        open: isOpen,
        name,
        available_agents: availableAgents,
      }
    }
  )
}
