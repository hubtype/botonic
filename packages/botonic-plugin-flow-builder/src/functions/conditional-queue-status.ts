/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios'

import { getWebpackEnvVar } from '../utils'

const _HUBTYPE_API_URL_ = getWebpackEnvVar(
  // @ts-ignore
  typeof HUBTYPE_API_URL !== 'undefined' && HUBTYPE_API_URL,
  'HUBTYPE_API_URL',
  'https://api.hubtype.com'
)

export async function conditionalQueueStatus({
  queue_id,
}: {
  queue_id: string
}): Promise<string> {
  const response = await axios.get(
    `${_HUBTYPE_API_URL_}/v1/queues/${queue_id}/availability/`,
    // TODO: Make it configurable in the future
    {
      params: {
        check_queue_schedule: true,
        check_waiting_cases: false,
        check_available_agents: false,
      },
    }
  )
  const isAvailable = response.data.available
  return isAvailable ? 'open' : 'closed'
}
