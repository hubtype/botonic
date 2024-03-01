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
  open = 'open',
  closed = 'closed',
  openWithoutAgents = 'open-without-agents',
}

export async function conditionalQueueStatus({
  queue_id,
  check_available_agents,
}: ConditionalQueueStatusArgs): Promise<QueueStatusResult> {
  const data = await getQueueAvailability(queue_id, check_available_agents)
  if (check_available_agents && data.open && data.available_agents === 0) {
    return QueueStatusResult.openWithoutAgents
  }
  return data.open ? QueueStatusResult.open : QueueStatusResult.closed
}

interface AvailabilityData {
  available: boolean
  waiting_cases: number
  availability_threshold_waiting_cases: number
  open: boolean
  name: string
  available_agents: number
}

export async function getQueueAvailability(
  queueId: string,
  check_available_agents = false
): Promise<AvailabilityData> {
  const response = await axios.get(
    `${HUBTYPE_API_URL}/public/v1/queues/${queueId}/availability/`,
    // TODO: Make it configurable in the future
    {
      params: {
        check_queue_schedule: true,
        check_waiting_cases: false,
        check_available_agents: check_available_agents,
      },
    }
  )
  return response.data
}
