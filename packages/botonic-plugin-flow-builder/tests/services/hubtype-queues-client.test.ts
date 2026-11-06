import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import axios from 'axios'

import type { AvailabilityData } from '../../src/services/hubtype-queues-client'
import { HubtypeQueuesClient } from '../../src/services/hubtype-queues-client'
import { createServiceClientBotContext } from '../helpers/service-client-test-context'

jest.mock('axios')
const axiosGetMock = axios.get as jest.MockedFunction<typeof axios.get>

describe('HubtypeQueuesClient', () => {
  const hubtypeApi = 'https://api.test.hubtype.com'
  const queueId = 'queue-1'

  beforeEach(() => {
    axiosGetMock.mockReset()
  })

  test('getAvailability sends default query flags', async () => {
    const data: AvailabilityData = {
      available: true,
      waiting_cases: 0,
      availability_threshold_waiting_cases: 0,
      open: true,
      name: 'Q',
      available_agents: 0,
    }
    axiosGetMock.mockResolvedValue({ data })

    const client = new HubtypeQueuesClient(
      createServiceClientBotContext({ hubtypeApi })
    )
    const result = await client.getAvailability(queueId)

    expect(axiosGetMock).toHaveBeenCalledWith(
      `${hubtypeApi}/external/v1/queues/${queueId}/availability/`,
      {
        params: {
          check_queue_schedule: true,
          check_waiting_cases: false,
          check_available_agents: false,
        },
      }
    )
    expect(result).toEqual(data)
  })

  test('getAvailability sets check_available_agents when requested', async () => {
    const data: AvailabilityData = {
      available: true,
      waiting_cases: 1,
      availability_threshold_waiting_cases: 0,
      open: true,
      name: 'Q',
      available_agents: 2,
    }
    axiosGetMock.mockResolvedValue({ data })

    const client = new HubtypeQueuesClient(
      createServiceClientBotContext({ hubtypeApi })
    )
    await client.getAvailability(queueId, true)

    expect(axiosGetMock).toHaveBeenCalledWith(
      `${hubtypeApi}/external/v1/queues/${queueId}/availability/`,
      {
        params: {
          check_queue_schedule: true,
          check_waiting_cases: false,
          check_available_agents: true,
        },
      }
    )
  })
})
