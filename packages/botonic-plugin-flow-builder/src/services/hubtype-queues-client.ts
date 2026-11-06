import type { BotContext } from '@botonic/core'
import axios from 'axios'

import { HubtypeClientBase } from './hubtype-client-base'

export interface AvailabilityData {
  available: boolean
  waiting_cases: number
  availability_threshold_waiting_cases: number
  open: boolean
  name: string
  available_agents: number
}
export class HubtypeQueuesClient extends HubtypeClientBase {
  constructor(botContext: BotContext) {
    super(botContext)
  }

  async getAvailability(
    queueId: string,
    checkAvailableAgents?: boolean
  ): Promise<AvailabilityData> {
    const response = await axios.get(
      `${this.hubtypeApiUrl}/external/v1/queues/${queueId}/availability/`,
      {
        params: {
          check_queue_schedule: true,
          check_waiting_cases: false,
          check_available_agents: checkAvailableAgents || false,
        },
      }
    )
    return response.data
  }
}
