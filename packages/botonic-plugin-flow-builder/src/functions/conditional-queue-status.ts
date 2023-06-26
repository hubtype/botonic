import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { getFlowBuilderPlugin } from '../helpers'
import { getWebpackEnvVar } from '../utils'

const _HUBTYPE_API_URL_ = getWebpackEnvVar(
  // @ts-ignore
  typeof HUBTYPE_API_URL !== 'undefined' && HUBTYPE_API_URL,
  'HUBTYPE_API_URL',
  'https://api.hubtype.com'
)

type ConditionalQueueStatusArgs = {
  request: ActionRequest
  queue_id: string
  queue_name: string
}

export async function conditionalQueueStatus({
  request,
  queue_id,
  queue_name,
}: ConditionalQueueStatusArgs): Promise<string> {
  const data = await getQueueAvailability(queue_id)
  const isAvailable = data.available
  return isAvailable ? 'open' : 'closed'
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
  queueId: string
): Promise<AvailabilityData> {
  const response = await axios.get(
    `${_HUBTYPE_API_URL_}/v1/queues/${queueId}/availability/`,
    // TODO: Make it configurable in the future
    {
      params: {
        check_queue_schedule: true,
        check_waiting_cases: false,
        check_available_agents: false,
      },
    }
  )
  return response.data
}
