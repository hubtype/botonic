import { ActionRequest } from '@botonic/react'
import axios from 'axios'

const HUBTYPE_API_URL = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

type ConditionalQueueStatusArgs = {
  request: ActionRequest
  queue_id: string
  queue_name: string
  check_available_agents: boolean
}

enum QueueStatusResult {
  OPEN = 'open',
  CLOSED = 'closed',
  OPEN_WITHOUT_AGENTS = 'open-without-agents',
}

export async function conditionalQueueStatus({
  queue_id,
  check_available_agents,
}: ConditionalQueueStatusArgs): Promise<QueueStatusResult> {
  const data = await getQueueAvailability(queue_id, check_available_agents)
  if (check_available_agents && data.open && data.available_agents === 0) {
    return QueueStatusResult.OPEN_WITHOUT_AGENTS
  }
  return data.open ? QueueStatusResult.OPEN : QueueStatusResult.CLOSED
}

export class HubtypeQueuesApi {
  public queueId: string
  public checkAvailableAgents: boolean

  constructor(queueId: string, checkAvailableAgents?: boolean) {
    this.queueId = queueId
    this.checkAvailableAgents = checkAvailableAgents || false
  }

  async getAvailability(): Promise<AvailabilityData> {
    const response = await axios.get(
      `${HUBTYPE_API_URL}/public/v1/queues/${this.queueId}/availability/`,
      // TODO: Make it configurable in the future
      {
        params: {
          check_queue_schedule: true,
          check_waiting_cases: false,
          check_available_agents: this.checkAvailableAgents,
        },
      }
    )
    return response.data
  }
}

export interface AvailabilityData {
  available: boolean
  waiting_cases: number
  availability_threshold_waiting_cases: number
  open: boolean
  name: string
  available_agents: number
}

export async function getQueueAvailability(
  queueId: string,
  checkAvailableAgents = false
): Promise<AvailabilityData> {
  const queuesApi = new HubtypeQueuesApi(queueId, checkAvailableAgents)
  return await queuesApi.getAvailability()
}
